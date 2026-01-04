// ==UserScript==
// @name         调时间优化
// @namespace    http://tampermonkey.net/
// @version      0.5.19
// @description  优化服务器调时间功能，加入各种便利性功能。
// @author       JMRY
// @match        http://*/tool/setservertime.php
// @match        http://*/tool/setservertime_cn.php
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://greasyfork.org/scripts/422934-jquery-dom/code/JQuery%20DOM.js?version=1126730
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @downloadURL https://update.greasyfork.org/scripts/456366/%E8%B0%83%E6%97%B6%E9%97%B4%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/456366/%E8%B0%83%E6%97%B6%E9%97%B4%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/*
TODO:
- 自动/手动执行队列功能
  - 通过自定义一组或多组执行队列，只需点击执行按钮，即可手动循环执行队列。
  - 通过设定间隔时间，点击自动执行按钮，即可自动循环执行队列。
  - 点击队列中的时间，即可从此位置开始，自动或手动循环执行队列。
*/
/*
0.5.19 20250902
- 修复排序导致数据清空的bug。
- 修复排序时列表反向的bug。
0.5.18 20250714
- 优化调时间按钮文字显示。
0.5.17
- 加入主动向父级页面推送服务器时间功能。
0.5.16
- 加入双击按钮自动触发调时间功能。
0.5.15
- 优化自动点击逻辑和显示。
- 加入5秒后跨周一功能。
0.5.14
- 加入自动点击上次使用条目功能。
0.5.13
- 加入上次使用标亮功能。
0.5.12
- 适配新版调时间格式。
0.5.11
- 优化免刷新模式的处理逻辑。
0.5.10
- 加入服务器时间标题显示。
- 加入同步倒计时提示。
- 优化代码结构和性能。
0.5.9
- 修复有概率重复计时的bug。
- 加入同步时间倒计时秒。
0.5.8
- 加入自定义时间描述功能。
- 加入自动刷新功能。
- 优化获取时间数据的算法。

0.5.7
- 加入setservertime_cn.php路径。

0.5.6
- 加入10秒后下个整点功能。

0.5.5
- 加入10秒后跨周功能。

0.5.4
- 加入显示当前服务器名的功能，以免调错时间。
- 调整时间选择框，改为横向排序和滚动。

0.5.3
- 加入5秒后跨天功能。

0.5.2
- 调整时间按钮条目宽度，以适应更长内容。
- 修复连续排序时，会造成排序混乱的bug。

0.5.1
- 优化日期时间识别算法，提升兼容性。

0.5
- 重构时间操作功能。
- 加入时间操作排序功能。
- 加入时间操作区域框架。
- 调整部分UI显示效果。
*/
String.prototype.replaceAll = function(org,tgt){
    return this.split(org).join(tgt);
}
String.prototype.insert = function(start, newStr) {
    return this.slice(0, start) + newStr + this.slice(start);
};
String.prototype.trimHtml = function(){
    return this.replace(/<[^>]*>/g, ``);
}
Date.prototype.format = function(fmt) {
  function getYearWeek(date) {
    var date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var date2 = new Date(date.getFullYear(), 0, 1);

    //获取1月1号星期（以周一为第一天，0周一~6周日）
    var dateWeekNum = date2.getDay() - 1;
    if (dateWeekNum < 0) {
      dateWeekNum = 6;
    }
    if (dateWeekNum < 4) {
      //前移日期
      date2.setDate(date2.getDate() - dateWeekNum);
    } else {
      //后移日期
      date2.setDate(date2.getDate() + 7 - dateWeekNum);
    }
    var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if (d < 0) {
      var date3 = new Date(date1.getFullYear() - 1, 11, 31);
      return getYearWeek(date3);
    } else {
      //得到年数周数
      var year = date1.getFullYear();
      var week = Math.ceil((d + 1) / 7);
      return week;
    }
  }

  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
    "W+": getYearWeek(this), //周数
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  return fmt;
};
Number.prototype.az = function(n = 2) {
    let s = "";
    for (let i = 1; i < n; i++) {
        s += '0';
    }
    return (s + this).slice(-1 * n);
}

function sendWindowMessage(type, url, data){
    window.parent.postMessage({type:'FROM_WINDOW', data:{type:type, url:url, data:data}}, `*`);
}

// 计算指定时间是星期几
function getWeekday(date){
   // date例如:'2022-03-05'
    var weekArray = new Array("星期日","星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
    var week  = weekArray[new Date(date).getDay()]
    return week
}

function getNextWeekDayDis(date, day){
    let curDay=new Date(date).getDay();
    let curDayTmp=curDay;
    let isNextDay=false;
    let dayDis=0;

    while(dayDis<=101){
        curDayTmp++;
        if(curDayTmp>6){
            curDayTmp=0;
            isNextDay=true;
        }
        dayDis++;
        if(isNextDay && curDayTmp==day){
            break;
        }
        if(dayDis>100){
            dayDis=NaN;
            break;
        }
    }
    return dayDis;
}

function getServerTime(t){
    let tStr=t!=undefined?t:$(`.dateTime`).html();
    let dateTimeArr=tStr.split(` `);
    let dateStr=dateTimeArr[0].trim().insert(6,`/`).insert(4,`/`);
    let timeStr=dateTimeArr[1].split(`星期`)[0].trim();
    return `${dateStr} ${timeStr}`;

    for(let i=0; i<document.forms.length; i++){
        let formText=document.forms[i].innerText.split(` `);
        console.log(`Form Text: `,formText);
        //dateStr为长度为8位的纯数字，因此通过算法定位。timeStr为dateStr.next
        let dateStr, timeStr;
        for(let d=0; d<formText.length; d++){
            let curF=formText[d];
            if(curF.length==8 && !isNaN(curF)){ //定位8位日期
                dateStr=curF.insert(6,`/`).insert(4,`/`);
                timeStr=formText[d+1]; //日期的下一个成员即为时间
                break;
            }
        }
        if(!dateStr &&!timeStr){
            continue;
        }
        //let dateStr=formText[formText.length-2];
        //dateStr=dateStr.insert(6,`/`).insert(4,`/`);
        //let timeStr=formText[formText.length-1];
        let textStr=`${dateStr} ${timeStr}`;
        if(textStr==`// `){
            continue;
        }
        console.log(textStr);
        return textStr;
    }
}

async function getServerTimeFromServer(){
    let url=window.location.href;
    let content=await fetch(window.location.href).then(t=>t.text());
    content=content.trim().trimHtml().trim().split(`\n`);
    //return content[content.length-1].trim();
    return content.at(-1).trim();
}

let customStyle=`
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
        -webkit-appearance: none;
}
button{
    margin:1px;
    height:24px;
}
.handle{
    width:48px;
}
.addInput{
    margin:1px;
    width:48px;
    height:24px;
    text-align:right;
}
.addInput.desc{
    width:128px;
    text-align:left;
}
#add, .addOptBu{
    width:48px;
}
.addZone{
    display:inline-block;
}
.addDiv{
    height:26px;
    padding-left:10px;
    padding-right:10px;
    background-color:rgba(255,255,0,0.5);
}
.customTime{
    width:192px;
    font-size:12px;
    overflow:hidden;
    white-space: nowrap;
}
.sel{
    width:1520px;
    height:416px;
    margin-top:1px;
    overflow-y:hidden;
    overflow-x:scroll;
    outline:1px solid;
}
ul,li{
	list-style: none;
	padding: 0px;
	margin: 0px;
    vertical-align:middle;
}
ul{
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;
    height:390px;
}
li{
    display:inline-block;
    margin-right:8px;
    height:26px;
    width:300px;
}

.sortable-ghost {
	opacity: 0;
	/*background-color: #F4E2C9;*/
}
.hostname{
    font-size:20px;
    color:#F00;
}
.enabled{
    background-color:rgba(128,255,128,1);
}

.changed{
    border-color:#F00;
}

.lastClickBu{
    background-color:rgba(255,255,192,1);
}
`;

let userName=`lmh`;
function insertOptmize(){
    $(`.hostname`).remove();
    let hostName=window.location.hostname;
    let hostSplit=hostName.split(`.`);
    $(`body`).prependDOM(`span`,{id:`hostname`,class:`hostname`,html:`当前服务器：${window.location.hostname}`});
    $(`head`).appendDOM(`title`,{class:`hostname`,html:`服务器时间-${window.location.hostname.split(`.`).at(-1)}`});
    //if($(`input`).length>=4){
    if($(`input`).length>=4 && $(`input`).eq(0).val()==``){
        $(`input`).eq(0).val(userName);
    }
    $(`#opt`).remove();
    //$(`.weekDay`).remove();

    let serverTimeText=$(`input[name=getstime]`)[0].nextSibling.data.trim();
    if(serverTimeText){
        $($(`input[name=getstime]`)[0].nextSibling).remove();
        $(`input[name=getstime]`).after(` <span class="dateTime">${serverTimeText}</span>`);
        $(`.dateTime`).after(` <span class="weekDay"></span>`);
        if(!serverTimeText.includes(`星期`)){
            $(`.weekDay`).html(getWeekday(getServerTime()));
        }
    }

    $(`body`).appendDOM(`div`,{id:`opt`,class:`opt`,children:[
        //基础功能
        {tag:`button`,attr:{id:`resetInput`,html:`重置`,bind:{click(){setTimeInput(`resetInput`,`resetInput`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`br`,html:``},
        {tag:`button`,attr:{id:`30sNextDay`,html:`30秒后跨天`,bind:{click(){setTimeInput(`30sNextDay`,`30sNextDay`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`button`,attr:{id:`10sNextDay`,html:`10秒后跨天`,bind:{click(){setTimeInput(`10sNextDay`,`10sNextDay`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`button`,attr:{id:`5sNextDay`,html:`5秒后跨天`,bind:{click(){setTimeInput(`5sNextDay`,`5sNextDay`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`button`,attr:{id:`10sNextHour`,html:`10秒后下个整点`,bind:{click(){setTimeInput(`10sNextHour`,`10sNextHour`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`button`,attr:{id:`nextDayNow`,html:`第二天此时`,bind:{click(){setTimeInput(`nextDayNow`,`nextDayNow`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`button`,attr:{id:`nextWeekNow`,html:`下一周此时`,bind:{click(){setTimeInput(`nextWeekNow`,`nextWeekNow`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`button`,attr:{id:`10sNextWeek1`,html:`10秒后跨周一`,bind:{click(){setTimeInput(`10sNextWeek1`,`10sNextWeek1`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`button`,attr:{id:`5sNextWeek1`,html:`5秒后跨周一`,bind:{click(){setTimeInput(`5sNextWeek1`,`5sNextWeek1`)},dblclick(){$(this).click();$(`input[type=submit][value=修改]`).click()}}}},
        {tag:`hr`,html:``},
        //自定义扩展
        {tag:`button`,attr:{id:`add`,html:`添加`,bind:{click(){
            if($(`.addDiv`).length<=0){
                $(`#addZone`).appendDOM(`div`,{id:`addDiv`,class:`addDiv`,children:[
                    {tag:`input`,attr:{id:`day`,class:`addInput`,value:0,type:`number`},html:`天`},
                    {tag:`input`,attr:{id:`hour`,class:`addInput`,value:0,type:`number`},html:`小时`},
                    {tag:`input`,attr:{id:`minute`,class:`addInput`,value:0,type:`number`},html:`分钟`},
                    {tag:`input`,attr:{id:`second`,class:`addInput`,value:0,type:`number`},html:`秒 说明`},
                    {tag:`input`,attr:{id:`desc`,class:`addInput desc`,value:``,type:`text`}},
                    {tag:`button`,attr:{id:`addData`,class:`addOptBu`,html:`添加`,bind:{click(){
                        let bool=addCustomData($(`#day`).val(),$(`#hour`).val(),$(`#minute`).val(),$(`#second`).val(),false,$(`#desc`).val());
                        if(bool){
                            $(`#addDiv`).remove();
                        }
                    }}}},
                    {tag:`button`,attr:{id:`cancel`,class:`addOptBu`,html:`取消`,bind:{click(){$(`#addDiv`).remove();}}}},
                ]});
            }
        }}}},
        {tag:`button`,attr:{id:`addCustomTime`,html:`添加具体时间`,bind:{click(){
            if($(`.addDiv`).length<=0){
                $(`#addZone`).appendDOM(`div`,{id:`addDiv`,class:`addDiv`,children:[
                    {tag:`input`,attr:{id:`day`,class:`addInput`,value:0,type:`number`},html:`天`},
                    {tag:`input`,attr:{id:`hour`,class:`addInput`,value:0,type:`number`},html:`:`},
                    {tag:`input`,attr:{id:`minute`,class:`addInput`,value:0,type:`number`},html:`:`},
                    {tag:`input`,attr:{id:`second`,class:`addInput`,value:0,type:`number`},html:` 说明`},
                    {tag:`input`,attr:{id:`desc`,class:`addInput desc`,value:``,type:`text`}},
                    {tag:`button`,attr:{id:`addData`,class:`addOptBu`,html:`添加`,bind:{click(){
                        let bool=addCustomData($(`#day`).val(),$(`#hour`).val(),$(`#minute`).val(),$(`#second`).val(),true,$(`#desc`).val());
                        if(bool){
                            $(`#addDiv`).remove();
                        }
                    }}}},
                    {tag:`button`,attr:{id:`cancel`,class:`addOptBu`,html:`取消`,bind:{click(){$(`#addDiv`).remove();}}}},
                ]});
            }
        }}}},
        {tag:`div`,attr:{id:`addZone`,class:`addZone`}},
        {tag:`div`,attr:{id:`sel`,class:`sel`,children:[
            {tag:`ul`,attr:{id:`customUl`,class:`customUl`}},
        ]}},
    ]});
    //主题样式
    $(`#opt`).append(`<style>${customStyle}</style>`);

    function attachCustomList(){
        $(`#customUl`).html(``);
        let customList=[];
        for(let i=0; i<customData.length; i++){
            let cur=customData[i];
            customList.push({tag:`li`,attr:{id:`li_${i}`,dragindex:i,children:[
                {tag:`button`,attr:{id:`handle_${i}`,class:`handle`,html:`＝`}},
                {tag:`button`,attr:{id:`custom_${i}`,class:`customTime`,html:cur.text,bind:{
                    click:{
                        data:{index:i},
                        function(e){
                            setTimeInput(customData[e.data.index].time,`custom_${e.data.index}`);
                        }
                    },
                    dblclick:{
                        function(e){
                            $(this).click();
                            $(`input[type=submit][value=修改]`).click();
                        }
                    }
                }}},
                {tag:`button`,attr:{id:`remove_${i}`,class:`customTimeRemove`,html:`删除`,bind:{click:{
                    data:{index:i},
                    function(e){
                        removeCustomData(e.data.index);
                    }
                }}}},
            ]}});
        }
        $(`#customUl`).appendDOM(customList);
    }
    attachCustomList();

    //排序
    Sortable.create(document.getElementById(`customUl`), {
		animation: 300,
        handle: '.handle',
		onEnd: function(evt){ //拖拽完毕之后发生该事件
			// rebuildOrder(evt.from);
            let sortScrollTop=$(`#sel`).scrollTop();
			let sortArray=new Array();
			let sortSelect;
			for(let i=0; i<evt.to.children.length; i++){
				sortArray.push(customData[parseInt(evt.to.children[i].getAttribute(`dragindex`))]);
			}
			customData=sortArray.reverse(); // 修复排序后反向的bug，用reverse
            saveStorage();
            attachCustomList();
            $(`#sel`).scrollTop(sortScrollTop);
		}
	});

    //横向滚轮
    let selZone=document.getElementById(`sel`);
    selZone.addEventListener('mousewheel',handler,false)
    function handler(event){
		var detail = event.wheelDelta || event.detail;
		var moveForwardStep = -1;
		var moveBackStep = 1;
		var step = 0;
		if(detail > 0){
				step = moveForwardStep*100;
		}else{
			step = moveBackStep * 100;
		}
		selZone.scrollLeft += step;
	}
}

let isAutoRefresh=false;
let autoRefreshInterval;
function insertAutoRefresh(){
    clearInterval(autoRefreshInterval);
    $(`.autoBu`).remove();
    $(`input[value=修改]`).afterDOM(`button`,{id:`autoBu`,class:`autoBu ${isAutoRefresh?`enabled`:``}`,html:`自动刷新模式 <span id="count"></span>`,bind:{
        click(e){
            e.preventDefault();
            isAutoRefresh=!isAutoRefresh;
            insertAutoRefresh();
            return false;
        }
    }});

    $(`input[type=submit]`).unbind(`click`);
    $(`input[name=getstime]`).unbind(`click`);
    if(isAutoRefresh){
        // 修改按钮的处理
        $(`input[value=修改]`).bind(`click`,function(e){
            $(`button, input`).attr(`disabled`,true);
            e.preventDefault();
            clearInterval(autoRefreshInterval);
            let formData=new FormData();
            formData.append(`username`,$(`input[name=username]`).val());
            formData.append(`date`,$(`input[name=date]`).val());
            console.log(`submit form: `,formData);
            fetch(window.location.href, {
                method: 'POST',
                body: formData
            }).then(t=>t.text()).then(t=>{
                console.log(t);
                $(`input[name=date]`).removeClass(`changed`);
                $(`button, input`).removeAttr(`disabled`);
                insertAutoRefresh();
            });
            return false;
        });
        // 服务器当前时间的处理
        $(`input[name=getstime]`).bind(`click`,(e)=>{
            e.preventDefault();
            window.location.reload();
            return false;
        });
        // 自动刷新功能
        let count=1;
        clearInterval(autoRefreshInterval);
        getServerTimeFromServer().then(t=>{
            let nt=new Date(getServerTime(t)).getTime();
            let ntStr=new Date(nt+1000).format(`yyyyMMdd hh:mm:ss`);
            $(`.dateTime`).html(ntStr);
            if(!ntStr.includes(`星期`)){ //兼容舰队有星期的写法
                $(`.weekDay`).html(getWeekday(getServerTime(t)));
            }else{
                $(`.weekDay`).html(``);
            }
            clearInterval(autoRefreshInterval);
            autoRefreshInterval=setInterval(()=>{
                //if(count%10==0){ //不能用>=来判断，否则会在同步时，读秒不自然
                if(count>=10){
                    //getServerTimeFromServer().then(t=>$(`.dateTime`).html(t));
                    console.log(`Sync time ${count}`);
                    clearInterval(autoRefreshInterval);
                    insertAutoRefresh();
                }else{
                    let nt=new Date(getServerTime()).getTime();
                    let ntStr=new Date(nt+1000).format(`yyyyMMdd hh:mm:ss`);
                    $(`.dateTime`).html(ntStr);
                    if(!ntStr.includes(`星期`)){ //兼容舰队有星期的写法
                       $(`.weekDay`).html(getWeekday(getServerTime(ntStr)));
                    }else{
                        $(`.weekDay`).html(``);
                    }
                }
                let countSecond=10-count;
                $(`#count`).html(`${countSecond<=0?`同步中`:`同步${countSecond}`}`);
                sendWindowMessage(`TIME`,window.location.href,getServerTime()); // 发送当前时间的html消息
                count++;
                //getServerTimeFromServer().then(t=>$(`.dateTime`).html(t));
            },1000);
        });
    }else{
        clearInterval(autoRefreshInterval);
    }
}

let isAutoClick=false;
let autoClickInterval;
function insertAutoClick(){
    $(`#autoBu`).afterDOM(`button`,{id:`autoClickBu`,class:`autoClickBu`,html:`自动点击 <span id="autoCount"></span>`,bind:{click(e){
        e.preventDefault();
        if(!isAutoClick){
            if(!isAutoRefresh){
                isAutoRefresh=true;
                insertAutoRefresh();
            }
            clearInterval(autoClickInterval);
            let autoSecond=parseInt($(`#autoClickTime`).val());
            if(autoSecond && !isNaN(autoSecond)){
                $(`#autoClickBu`).addClass(`enabled`);
                isAutoClick=true;
                let count=1;
                autoClickInterval=setInterval(function(){
                    $(`#autoCount`).html(`倒计时${autoSecond - count % autoSecond}`);
                    if(count%autoSecond==0){
                        let lastClickEl=$(`.lastClickBu`).eq(0);
                        if(lastClickEl){
                            lastClickEl.click();
                            $(`input[value=修改]`).click();
                        }
                    }
                    count++;
                },1000);
            }
        }else{
            isAutoClick=false;
            clearInterval(autoClickInterval);
            $(`#autoCount`).html(``);
            $(`#autoClickBu`).removeClass(`enabled`);
        }
        return false;
    }}});
    $(`#autoClickBu`).afterDOM(`input`,{id:`autoClickTime`,class:`autoClickTime`,type:`number`,placeholder:`秒`,value:`10`});
}

function addCustomData(d,h,m,s,custom,desc){
    d=d||0;
    h=h||0;
    m=m||0;
    s=s||0;
    desc=`${desc} `||``;
    let str=desc;
    if(custom==true){
        if(parseInt(d)!=0){
            str+=`+${d}天`;
        }
        str+=`${parseInt(h).az()}:${parseInt(m).az()}:${parseInt(s).az()}`;
        customData.push({time:[parseInt(d),parseInt(h),parseInt(m),parseInt(s),custom],text:str});
    }else{
        if(parseInt(d)!=0){
            str+=`${d}天`;
        }
        if(parseInt(h)!=0){
            str+=`${h}小时`;
        }
        if(parseInt(m)!=0){
            str+=`${m}分钟`;
        }
        if(parseInt(s)!=0){
            str+=`${s}秒`;
        }
        if(str==''){
            str=`0秒`;
        }
        customData.push({time:[parseInt(d),parseInt(h),parseInt(m),parseInt(s)],text:str});
    }
    saveStorage();
    insertOptmize();
    return true;
}

function removeCustomData(index){
    customData.splice(index,1);
    saveStorage();
    insertOptmize();
}


function setTimeInput(key, elid){
    console.log(key);
    let serverTime=getServerTime();
    let serverTimestamp=parseInt(new Date(serverTime).getTime()/1000);
    let textStr=``;
    switch(key){
        case `30sNextDay`:
            textStr=(new Date(serverTimestamp*1000)).format(`yyyyMMdd`);
            textStr+=` 23:59:30`;
        break;

        case `10sNextDay`:
            textStr=(new Date(serverTimestamp*1000)).format(`yyyyMMdd`);
            textStr+=` 23:59:50`;
        break;

        case `5sNextDay`:
            textStr=(new Date(serverTimestamp*1000)).format(`yyyyMMdd`);
            textStr+=` 23:59:55`;
        break;

        case `10sNextHour`:
            textStr=(new Date(serverTimestamp*1000)).format(`yyyyMMdd hh`);
            textStr+=`:59:50`;
        break;

        case `nextDayNow`:
            textStr=(new Date( (serverTimestamp+86400)*1000) ).format(`yyyyMMdd hh:mm:ss`);
        break;

        case `nextWeekNow`:
            textStr=(new Date( (serverTimestamp+86400*7)*1000) ).format(`yyyyMMdd hh:mm:ss`);
        break;

        case `10sNextWeek1`:
            textStr=(new Date( ( serverTimestamp+86400*getNextWeekDayDis(serverTime,0) )*1000) ).format(`yyyyMMdd`);
            textStr+=` 23:59:50`;
        break;

        case `5sNextWeek1`:
            textStr=(new Date( ( serverTimestamp+86400*getNextWeekDayDis(serverTime,0) )*1000) ).format(`yyyyMMdd`);
            textStr+=` 23:59:55`;
        break;

        case `resetInput`:
            textStr=serverTime.replaceAll(`/`,``);
        break;

        default:
            if(typeof key==`object` && key.length==4){
                let day=86400*key[0];
                let hour=3600*key[1];
                let minute=60*key[2];
                let second=key[3];
                let totalSecond=day+hour+minute+second;
                let newServerTimestamp=serverTimestamp+totalSecond;
                textStr=(new Date( (newServerTimestamp)*1000) ).format(`yyyyMMdd hh:mm:ss`);
            }else if(typeof key==`object` && key.length==5 && key[4]==true){
                let days=86400*key[0];
                let timeStr=`${key[1].az()}:${key[2].az()}:${key[3].az()}`;
                let newServerTimestamp=serverTimestamp+days;
                textStr=`${(new Date( (newServerTimestamp)*1000) ).format(`yyyyMMdd`)} ${timeStr}`;
            }
        break;
    }

    $(`input[name=date]`).val(textStr);
    $(`input[name=date]`).addClass(`changed`);
    $(`button`).removeClass(`lastClickBu`);
    $(`#${elid}`).addClass(`lastClickBu`);

    //let dateInput=document.forms[0].date;
    //document.forms[0].date.value=textStr;
    //document.forms[0].date.style=`border-color:#F00;`;
}

let customData=[];
function loadStorage(){
    let cd=localStorage.getItem(`customData`);
    if(cd==null){
        customData=[];
    }else{
        customData=JSON.parse(cd);
    }
}

function saveStorage(){
    localStorage.setItem(`customData`,JSON.stringify(customData));
}

function main(){
    loadStorage();
    insertOptmize();
    insertAutoRefresh();
    insertAutoClick();
    sendWindowMessage(`TIME`,window.location.href,getServerTime()); // 发送当前时间的html消息
}

(function() {
    'use strict';
    main();
    window.onload=function(){
        if($(`body`).html().includes(`The page you are looking for is temporarily unavailable`)){
            window.location.reload();
        }
    }
})();