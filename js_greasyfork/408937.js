// ==UserScript==
// @name         咕咕镇剩余价值收割机
// @namespace    https://greasyfork.org/zh-CN/users/453092
// @version      4.09
// @description  斗争者的小助手
// @author       ikarosf
// @match        https://www.guguzhen.com/fyg_pk.php
// @match        https://www.momozhen.com/fyg_pk.php
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js
// @require      https://unpkg.com/dexie@latest/dist/dexie.js
// @require      https://unpkg.com/dexie-export-import@latest/dist/dexie-export-import.js
// @require      https://greasyfork.org/scripts/409864-url-gbk-%E7%BC%96%E7%A0%81%E8%A7%A3%E7%A0%81%E5%BA%93/code/URL%20GBK%20%E7%BC%96%E7%A0%81%E8%A7%A3%E7%A0%81%E5%BA%93.js?version=840815
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.16.0/js/md5.min.js
// @resource     dateTimecss https://gitee.com/ikarosf/calendarjs/raw/master/calendar.css
// @connect      bbs.fygal.com
// @connect      kf.miaola.info
// @connect      bbs.kforz.com
// @connect      bbs.bakabbs.com
// @connect      bbs.365gal.com
// @connect      bbs.365galgame.com
// @connect      bbs.kfmax.com
// @connect      bbs.9shenmi.com
// @connect      bbs.kfpromax.com
// @connect      kf.miaola.work
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/408937/%E5%92%95%E5%92%95%E9%95%87%E5%89%A9%E4%BD%99%E4%BB%B7%E5%80%BC%E6%94%B6%E5%89%B2%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/408937/%E5%92%95%E5%92%95%E9%95%87%E5%89%A9%E4%BD%99%E4%BB%B7%E5%80%BC%E6%94%B6%E5%89%B2%E6%9C%BA.meta.js
// ==/UserScript==

async function fyg_pk_html() {
    'use strict';
    console.log("fyg_pk_html init")

    var goxing = false;
    const db = new Dexie("ggzharvester2");
    unsafeWindow.db = db;
    dbInit()

    var ctx = document.createElement("battleCountChart");
    var goxpanel= document.createElement('div');
    var goxpanelExtend= document.createElement('div');
    var detaillogpanel = document.createElement('div');
    var copydiv = document.createElement('textarea');
    var mask = document.createElement('div');
    var BattleLog = {}
    if(FM_getValue("BattleLog")!=null){
        console.log("BattleLog load")
        BattleLog = FM_getValue("BattleLog");
    }
    unsafeWindow.BattleLog = BattleLog;
    await transToDbdata();

    var showSM = true;
    var showcharlv = true;
    if(localStorage.getItem('showSM')!==null){
        showSM = eval(localStorage.getItem('showSM'));
    }
    if(localStorage.getItem('showcharlv')!==null){
        showcharlv = eval(localStorage.getItem('showcharlv'));
    }

    var mainHost = "0"
    if(localStorage.getItem('mainHost')!==null){
        mainHost = localStorage.getItem('mainHost');
    }

    var refreshNum = 0;
    if(localStorage.getItem('flashtime')===null){
        localStorage.setItem('flashtime',30 );
    }
    var refreshMaxtime = 30;
    refreshMaxtime = parseInt(localStorage.getItem('flashtime'));
    var refreshCountdownTime = refreshMaxtime;
    var mydivision = ""
    var myrank = -100;
    var mydogtag = -100;
    var changeLog = [];
    unsafeWindow.changeLog = changeLog;

    //----------------------------------------------------------------------------------
    var banpvpFlag = false , banpveFlag = false;

    var banbattletypediv= document.createElement('div');

    let banpvpcheckbox = document.createElement('input');
    banpvpcheckbox.setAttribute('type','checkbox');
    banpvpcheckbox.addEventListener('change',function(){
        banpvpFlag = banpvpcheckbox.checked;
        localStorage.setItem("banpvpFlag",banpvpFlag)
        banbattletypefunc();
    });
    banbattletypediv.appendChild(banpvpcheckbox);

    let banpvpcheckboxtext = document.createElement('i');
    banpvpcheckboxtext.innerText = "禁用打人";
    banpvpcheckboxtext.setAttribute('style',"margin-right:20px;");
    banpvpcheckboxtext.setAttribute('class',"smalldiv");
    banbattletypediv.appendChild(banpvpcheckboxtext);

    let banpvecheckbox = document.createElement('input');
    banpvecheckbox.setAttribute('type','checkbox');
    banpvecheckbox.addEventListener('change',function(){
        banpveFlag = banpvecheckbox.checked;
        localStorage.setItem("banpveFlag",banpveFlag)
        banbattletypefunc();
    });
    banbattletypediv.appendChild(banpvecheckbox);

    let banpvecheckboxtext = document.createElement('i');
    banpvecheckboxtext.innerText = "禁用打怪";
    banpvecheckboxtext.setAttribute('style',"margin-right:20px;");
    banpvecheckboxtext.setAttribute('class',"smalldiv");
    banbattletypediv.appendChild(banpvecheckboxtext);

    if(localStorage.getItem('banpvpFlag')=="true"){
        banpvpFlag = true;
        banpvpcheckbox.checked = true;
    }
    if(localStorage.getItem('banpveFlag')=="true"){
        banpveFlag = true;
        banpvecheckbox.checked = true;
    }
    //----------------------------------------------------------------------------------

    let progresschange = document.createElement('div');  //显示log
    progresschange.setAttribute('id','progresschange');
    progresschange.setAttribute('class','panel-body');

    //----------------------------------------------------------------------------------
    var get_user_theard_try_num = 0;

    var g_safeid = get_safeid();

    //---------------------------------------------------------

    function setflashtime(){
        var newtime = parseInt(prompt("新的刷新间隔：(填0则禁止刷新)",refreshMaxtime));
        if(!isNaN(newtime)&&newtime>0){
            localStorage.setItem('flashtime',newtime );
            refreshMaxtime = newtime;
            refreshCountdownTime = newtime;
            return;
        }
        if(!isNaN(newtime)&&newtime<=0){
            localStorage.setItem('flashtime',newtime );
            refreshMaxtime = -1;
        }
    }

    function setmainHost(){
        var newmainHost = prompt("注意此选项可能消耗主站搜索次数！\n格式如https://bbs.kfmax.com/（填0则不获取对手系数）",mainHost);
        if(newmainHost!=null&&newmainHost!=""){
            localStorage.setItem('mainHost',newmainHost );
            mainHost = newmainHost;
        }
        show_battle_log("主站域名:"+mainHost)
    }

    //------------------------------------------------------------------------------------------
    var read_rank_rightnow_flag = true;

    async function read_rank(){//主循环
        if(refreshMaxtime <= 0){
            $("#goxtiptext").text("无刷新");
            return;
        }
        if(!read_rank_rightnow_flag && --refreshCountdownTime>0){
            $("#goxtiptext").text("刷新进度倒计时 "+refreshCountdownTime);
        }else{
            $("#goxtiptext").text("刷新进度倒计时 "+0);
            refreshCountdownTime = refreshMaxtime;
            if(goxing) return;
            goxing = true;
            read_rank_rightnow_flag = false;

            try {
                var postRequestReturn = await postRequest();
                if(!postRequestReturn){
                    goxing = false;
                    return;
                }
                //todo

            }catch(err) {
                console.log(typeof(err))
            }
            progresschange.innerText = getChangeLogText();
            goxing = false;
        }
    }

    function postRequest(){ //获取段位进度、体力
        return new Promise((resolve, reject)=>{
            setTimeout(resolve, 10*1000,false)
            GM_xmlhttpRequest({
                method: 'POST',
                url: unsafeWindow.location.origin + `/fyg_read.php`,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                data: 'f=12',
                onload: response => {
                    //throw "throw error";
                    refreshNum++;
                    let responseDiv = $(response.responseText)
                    let newdivision = responseDiv.find(".fyg_colpz05").text(); //段位SSS
                    let newrank = parseInt(responseDiv.find(".fyg_colpz02").text()); //int
                    var alldogtagstr = responseDiv.find(".fyg_colpz03").text()
                    var dogtaglist = alldogtagstr.match(/(\d+) \/ (\d+)/)
                    let newdogtag = parseInt(dogtaglist[1]); //int
                    let changeFlag = false;
                    if(mydivision == ""){
                        mydivision = newdivision;
                    }else if(newdivision != mydivision){
                        document.getElementsByClassName('fyg_colpz05')[0].innerText = newdivision;
                        changeFlag = true;
                    }
                    if(myrank == -100){
                        myrank = newrank;
                    }
                    else if(newrank != myrank){
                        document.getElementsByClassName('fyg_colpz02')[0].innerText = newrank + "%";
                        changeFlag = true;
                    }
                    if(mydogtag == -100){
                        mydogtag = newdogtag;
                    }
                    else if(newdogtag != mydogtag){
                        document.getElementsByClassName('fyg_colpz03')[0].innerText = alldogtagstr + "";
                        mydogtag = newdogtag;
                    }

                    if(changeFlag){
                        appendChangeLogText("[{0} {1}%]->[{2} {3}%]".format(mydivision,myrank,newdivision,newrank));
                        mydivision = newdivision;
                        myrank = newrank;
                    }

                    resolve(true)
                },
                onerror:function(err){
                    resolve(false)
                },
                ontimeout : function(){
                    resolve(false)
                }
            });
        }) //Promise end
    }

    function getChangeLogText(){
        let LogText = "";
        LogText += "刷新次数: " +refreshNum + "\n";
        if(changeLog.length == 0){
            LogText += "未出现进度变动"
        }
        else{
            for(var i = 0;i<changeLog.length;i++){
                LogText += changeLog[i] + "\n"
            }
        }
        return LogText;
    }

    function appendChangeLogText(text){
        changeLog.push(getNowtime() + " " + text)
        progresschange.innerText = getChangeLogText();
    }

    function show_battle_log(text){
        $("#goxtipbottomtext").text(text);
    }

    function get_user_theard(name){
        var search_name = $URL.encode(name);
        show_battle_log('搜素帖子中')
        GM_xmlhttpRequest({
            method: "post",
            url: mainHost+'search.php',
            data: 'step=2&method=AND&sch_area=0&s_type=forum&f_fid=all&orderway=lastpost&asc=DESC&keyword=&pwuser='+search_name,
            headers:  {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            onload: function(res){
                if(res.status === 200){
                    let info = res.responseText;
                    //console.log(info)
                    let firstindex = info.indexOf("共搜索到");
                    if(firstindex == -1){
                        if( info.indexOf("用户不存在")!=-1){
                            show_battle_log('用户'+name+'不存在');
                            get_user_theard_try_num = 0;
                            return;
                        }
                        if( info.indexOf("你所属的用户组不能使用搜索功能")!=-1){
                            show_battle_log('主站域名错误或无权限');
                            get_user_theard_try_num = 0;
                            return;
                        }
                        console.log('搜索尝试次数：' + get_user_theard_try_num)
                        if(info.indexOf("搜索排队中")!=-1&&get_user_theard_try_num<3){
                            get_user_theard_try_num++;
                            setTimeout(get_user_theard,2000,name)
                        }else{
                            //console.log(info)
                            get_user_theard_try_num = 0;
                            show_battle_log('找不到'+name+'的帖子,可能他未发过主题帖')
                        }
                        return;
                    }
                    //let secondindex = info.indexOf("共搜索到",firstindex+1);
                    let secondindex = firstindex+200;
                    info = info.substring(firstindex,secondindex)
                    var theards=info.match(/read\.php.+?(?=")/g)
                    //console.log(theards)
                    get_user_mainpage(theards,name);
                }else{
                    show_battle_log('搜索对手帖子失败')
                    console.log(res)
                }
            },
            onerror : function(err){
                show_battle_log('搜索对手帖子错误,可能域名设置格式不正确')
                console.log(err)
            }
        });
    }

    function get_user_mainpage(theards,name){
        if(theards==null||theards.length<1){
            show_battle_log('找不到'+name+'的帖子')
            return}
        show_battle_log('进入帖子中')
        var theard = theards[0];
        GM_xmlhttpRequest({
            method: "get",
            url: mainHost+theard ,
            headers:  {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            onload: function(res){
                if(res.status === 200){
                    let info = res.responseText;
                    //console.log(info)
                    let firstindex = info.indexOf("楼主");
                    let afterinfo = info.substring(0,firstindex)
                    var mainpage=afterinfo.match(/profile\.php\?action=show.+?(?=" )/g)
                    if(mainpage==null||mainpage.length==0){

                        afterinfo = info.substring(0,firstindex+100)
                        mainpage=afterinfo.match(/\/user\/uid.+(?=" )/g)
                        get_user_LV(mainpage,name);
                    }else{
                        get_user_LV(mainpage,name);}
                }else{
                    show_battle_log('获取'+name+'主页失败')
                    console.log(res)
                }
            },
            onerror : function(err){
                show_battle_log('获取'+name+'主页错误')
                console.log(err)
            }
        });
    }

    function get_user_LV(mainpages,name){
        show_battle_log('进入主页中')
        if(mainpages==null||mainpages.length<1){
            show_battle_log('找不到'+name+'的主页')
            return;}
        var mainpage = mainpages[0];
        if(mainpage.indexOf("uid=null")!=-1){
            show_battle_log(name+'已被封禁')
            return;
        }
        GM_xmlhttpRequest({
            method: "get",
            url: mainHost+mainpage ,
            headers:  {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            onload: function(res){
                if(res.status === 200){
                    let info = res.responseText;
                    //console.log(info)
                    let afterinfo = info.replace(/\<\/strong\>/g,'');
                    var level = afterinfo.match(/(?<=神秘系数：)\d+/g)[0]
                    save_enemylevel(name,level);//存储对手系数
                    show_battle_log("获取"+name+"系数成功")
                }else{
                    show_battle_log('进入'+name+'主页失败')
                    console.log(res)
                }
            },
            onerror : function(err){
                show_battle_log('进入'+name+'主页错误')
                console.log(err)
            }
        });
    }

    function banbattletypefunc(){
        if(banpveFlag){
            $(".fyg_lh30:eq(1)").addClass("disabled")
        }else{
            $(".fyg_lh30:eq(1)").removeClass("disabled")
        }
        if(banpvpFlag){
            $(".fyg_lh30:eq(0)").addClass("disabled")
        }else{
            $(".fyg_lh30:eq(0)").removeClass("disabled")
        }
    }

    function mypklist(){
        $.ajax({
            type: "POST",
            url: "fyg_read.php",
            data: "f=12",
            success: function(msg){
                $("#pklist").html(msg);
                $('[data-toggle="tooltip"]').tooltip();
                banbattletypefunc();
            }
        });
    }

    var mycssinner = function () {        /*    #chartParent{    width:100%;max-width:1200px;    height:80%;        position:fixed;    margin:auto;    left:0;    right:0;    top:0;    bottom:0;    display:none;        z-index:1000;    }    .tc_xs{    overflow-x:hidden;    width:100%;    max-width:1200px;    height:80%;    //line-height:3rem;    background:#fff;    position:fixed;    margin:auto;    left:0;    right:0;    top:0;    bottom:0;    color:#666;    border-radius:4px;    display:none;    z-index:1000;    }    #mask{        display:none;        width:100%;        height:300%;        position:absolute;        top:0;        left:0;        z-index:2;        background-color:#000;        opacity:0.3;        }    #goxpanel{    width:20%;    height:60%;    min-width:280px;    line-height:3rem;    background:#ddf3f5;    position:fixed;    //left:10%;    //margin-left:-15%;    top:15%;    text-align:center;    color:#fff;    border-radius:4px;        }    #goxpanelExtend{    width:20%;    height:21%;    min-width:280px;    line-height:3rem;    background:#ddf3f5;    position:fixed;    //left:10%;    //margin-left:-15%;    top:75%;    text-align:center;    color:#000;    border-radius:4px;    display:none;        }    .goxtip{        width:100%;        background-color: #3280fc;        padding: 2px 10px;        text-align: left;        display: flex;        justify-content: space-between;    }    #goxtip2{    background-color: #3280aa;    }    .goxtip button,input,select,textarea {    font-family: inherit;    font-size: inherit;    line-height:normal;    }    .goxtipbottom{        position:absolute;        bottom:10px;    }    .detaillogitem>div>h3>span{    white-space: nowrap;    overflow: hidden;    text-overflow: ellipsis;    display: inline-block;    text-align: left;    }    #goxtipinfo{        color:#000;        text-align: left;        height: 90%;    }    .btn-details{        width:30%    }    #goxpanel a{    color:#FFF;    }    .battlelose>.nameandlevel {    background-color: #ffe5e0 !important;    }    .battletie>.nameandlevel {    background-color: #dbe5d9	 !important;    }    .nameandlevel{    cursor:pointer;    height:30px;    margin:auto;    color: #03a2b6;    text-align: center;    background-color:#ddf3f5;    }    .nameandlevel>h3{    margin-top:5px;    line-height: 200%;    }    #smallbar {    position: absolute;    right: 0px;    height: 100%;    width: 10px;    text-align: center;    display: flex;    align-items:center;    color: black;    cursor:pointer;    }    #extendbar {    position: absolute;    bottom: 0px;    height: 10px;    width: 100%;    line-height: 100%;    color: black;    cursor:pointer;    }        */    }
    function mycss(){
        GM_addStyle(mycssinner.getMultilines());
    }

    async function initgoxpanel(){
        $("body")[0].appendChild(goxpanel);
        $("body")[0].appendChild(goxpanelExtend);
        goxpanel.setAttribute('id','goxpanel');
        goxpanel.style.setProperty('max-width', (document.body.clientWidth-1300)/2+'px');
        goxpanel.innerHTML = `<div id="smallbar">&lt</div>
                              <div id="goxtip" class="goxtip"><a id="goxtiptext" title="设置刷新间隔"></a> </div>
                              <div id="goxtip2" class="goxtip smalldiv"></div>
                              <div id="goxtipinfo" class="smalldiv"></div><div id="goxtipbottom" class="goxtip goxtipbottom smalldiv"><a id="goxtipbottomtext" title="设置主站域名"></a>
                              <input type="text" class="btn btn-details" placeholder="战斗历史" readonly="true" id="date"></div><div id="extendbar">∨</div>`

        $("#goxtip2").append(banbattletypediv);
        $("#goxtipinfo").append(progresschange);
        progresschange.style.setProperty("overflow-y","auto");
        progresschange.style.setProperty("max-height","70%");

        $("#goxtiptext").click(setflashtime);
        $("#smallbar").click(dosmalldiv);
        show_battle_log("主站域名:"+mainHost)
        $("#goxtipbottomtext").click(setmainHost);

        $("#extendbar").click(function(){
            if($("#goxpanelExtend").css("display")=="none"){
                $("#extendbar").text("∧")
            }else{
                $("#extendbar").text("∨")
            }
            $("#goxpanelExtend").slideToggle(200);
        });
        goxpanelExtend.innerHTML =`<div>
        <input  value="30" id="TopDuring" style="width: 40px;">日内 遇到最多TOP</input>
        <input  value="15" id="TopNum" style="width: 40px;margin-right:15px;"></input>
        <input type="button" class="btn" value="查看" id="showTop"></input>
        </div>
        <div>
        <div>
        <input type="checkbox" id="showSM" style="width: 20px;">记录显示系数</input>
        <span style="width:20px;display: inline-block;"></span>
        <input type="checkbox" id="showcharlv" style="width: 20px;">记录显示等级</input>
        </div>
        <div>
        <input type="button" class="btn" value="手动删除记录" id="deletelog"></input>
        <input type="button" class="btn" value="根据用户名查询记录" id="showlogbyid"></input>
        </div>
        <div>
        <input type="button" class="btn" value="导出历史" id="exportlog"></input>
        <span style="width:20px;display: inline-block;"></span>
        导入历史：<input type="file" class="btn" value="导入历史" id="importlog" accept=".ggzjson" style="width: 90px;height:32px;display: inline-block;"></input>
        </div>
        `
        goxpanelExtend.setAttribute('id','goxpanelExtend');
        goxpanelExtend.style.setProperty('max-width', (document.body.clientWidth-1300)/2+'px');

        $("#showTop").click(async function(){
            var during = parseInt($("#TopDuring")[0].value)
            var num = parseInt($("#TopNum")[0].value)
            if(!(during>0)) return;
            if(!(num>0)) return;
            await table_date_set(during,num)
            $("#chartParent").fadeIn();
            mask.style.display = "block";
        })

        $("body")[0].appendChild(mask);
        mask.setAttribute('id','mask');
        mask.addEventListener('click', function(){
            $(".tc_xs").fadeOut();
            $("#chartParent").fadeOut();
            mask.style.display = "none";
        })
        $("body")[0].appendChild(detaillogpanel);
        detaillogpanel.setAttribute('class','tc_xs');
        detaillogpanel.setAttribute('style','display: none;overflow-y:auto;');
        $("body")[0].appendChild(copydiv);
        copydiv.setAttribute('style','opacity: 0;max-height:0;max-width:0;');

        var now = getLocDate()
        $("#date").datetime({
            type: "date",
            value: [now.getFullYear(), now.getMonth()+1, now.getDate()],
            active:await getDaysOfLog(),
            success: async function (res) {
                await detaillogpanelset(res)
                $(".tc_xs").fadeIn();
                mask.style.display = "block";
            }
        })

        $('#showSM').attr("checked", showSM);
        $("#showSM").change(function(){
            if (this.checked == true){
                showSM = true;
                localStorage.setItem('showSM',true );
            }else{
                showSM = false;
                localStorage.setItem('showSM',false );
            }
        })
        $('#showcharlv').attr("checked", showcharlv);
        $("#showcharlv").change(function(){
            if (this.checked == true){
                showcharlv = true;
                localStorage.setItem('showcharlv',true );
            }else{
                showcharlv = false;
                localStorage.setItem('showcharlv',false );
            }
        })

        $("#deletelog").click(function(){
            var dayss = parseInt(prompt("将多少天以前的战斗记录清除？\n警告：删除的记录无法恢复，假如填0将删除所有记录"))
            if(!isNaN(dayss)&&dayss>=0){
                autodeletelog(dayss)
                alert("清除完成，请刷新")
            }else{
                alert("输入错误或取消操作")
            }
        })

        $("#showlogbyid").click(async function(){
            var searchname = prompt("请输入要查询的用户名")
            if(searchname!=""){
                await detaillogpanelsetbyname(searchname)
                $(".tc_xs").fadeIn();
                mask.style.display = "block";
            }
        })

        $("#exportlog").click(async function(){
            let dbblob = await db.export();
            download(dbblob,'韭菜收割机历史数据.ggzjson');
        })

        $("#importlog").change(async function(){
            if(this.files && this.files[0]){
                var file = this.files[0];

                await db.import(file,{overwriteValues: true})
                alert("导入完毕，请刷新")
            }
        })
    }


    async function detaillogpanelset(key){
        var text = '';
        var divtext = '<div class="detaillogitem {0}"><div class="nameandlevel"><h3><span style="width: 120px;">{1}</span>'+
            (showSM?'<span style="width: 70px;">{2}</span>':"")+
            (showcharlv?'<span style="width: 40px;">{3}</span><span style="width: 80px;">{4}</span>':'')+
            '</h3></div><div style="display:none;">{5}</div></div>';

        var during_s = 24 * 60 * 60 * 1000
        var day = getLocDate(key)
        var day_ = new Date(day.getTime() + during_s)
        var item = await db.battleLog.where("time").between(day,day_,true,false).and(item => item.username == user).sortBy('time')
        if(item.length == 0){
            text+=divtext.format("","无数据","","","","");
        }else{
            var len=item.length;
            for(var i=len-1;i>=0;i--){
                var thisclass = '';
                var thisitem = item[i]
                if(thisitem.isWin === true){
                    thisclass="battlewin"
                }else if(thisitem.isWin === false){
                    thisclass="battlelose"
                }else if(thisitem.isWin === 0){
                    thisclass="battletie"
                }

                let name = thisitem.enemyname
                let xishu = get_enemylevel(name)
                if(xishu!=""){
                    xishu = "SM:"+xishu;
                }
                let char = thisitem.char
                let charlv = "LV:"+thisitem.charlevel

                text+=divtext.format(thisclass,name,xishu,char,charlv,thisitem.log);


            }
        }
        detaillogpanel.innerHTML = text;

        $(".nameandlevel").click(function(){
            $(this).next().toggle(200);
        });

        $('[data-toggle="tooltip"]').tooltip();
    }

    async function detaillogpanelsetbyname(key){
        var text = '';
        var divtext = '<div class="detaillogitem {0}"><div class="nameandlevel"><h3><span style="width: 120px;">{1}</span>'+
            (showcharlv?'<span style="width: 40px;">{2}</span><span style="width: 80px;">{3}</span>':'')+
            '<span style="width: 100px;">{4}</span>'+
            '</h3></div><div style="display:none;">{5}</div></div>';

        var item = await db.battleLog.where({username:user,enemyname:key}).sortBy('time')
        if(item.length == 0){
            text+=divtext.format("","无数据","","","","");
        }else{
            var len=item.length;
            for(var i=len-1;i>=0;i--){
                var thisclass = '';
                var thisitem = item[i]
                if(thisitem.isWin === true){
                    thisclass="battlewin"
                }else if(thisitem.isWin === false){
                    thisclass="battlelose"
                }else if(thisitem.isWin === 0){
                    thisclass="battletie"
                }

                let name = thisitem.enemyname
                let char = thisitem.char
                let charlv = "LV:"+thisitem.charlevel
                let thistime = getDateString(thisitem.time)

                text+=divtext.format(thisclass,name,char,charlv,thistime,thisitem.log);


            }
        }
        detaillogpanel.innerHTML = text;

        $(".nameandlevel").click(function(){
            $(this).next().toggle(200);
        });

        $('[data-toggle="tooltip"]').tooltip();
    }

    let observerBody1 = new MutationObserver(async ()=>{ //战斗记录
        var pkTextDiv = document.querySelector("#pk_text");
        unsafeWindow.pkTextDiv = pkTextDiv;
        var enemydivs = pkTextDiv.querySelectorAll("span.fyg_f18");
        if(enemydivs==null||enemydivs.length<2){return;}
        var enemyinfo = pkTextDiv.querySelectorAll("div.col-md-6")[1];
        var isbattlewin = pkTextDiv.querySelectorAll(".icon-smile").length>0;
        var isbattlelose = pkTextDiv.querySelectorAll(".icon-frown").length>0;
        var battleresult;
        if(isbattlewin){
            battleresult = true;
        }else if(isbattlelose){
            battleresult = false;
        }else{
            battleresult = 0;
        }

        var enemydiv = enemydivs[1];
        var enemydivtext = enemydiv.innerText;
        var einfolist = enemydivtext.match(/(.+)（(.+) Lv\.(\d+)/)
        var enemyname,echar,echarlv
        if(einfolist === null){
            einfolist = enemydivtext.match(/(.+)（/)
            enemyname = einfolist[1]
            echar = "无"//职业
            echarlv = "0"
        }else{
            enemyname = einfolist[1]
            echar = einfolist[2]//职业
            echarlv = einfolist[3]
        }


        /*console.log(enemydivtext)
        console.log(echar)
        console.log(echarlv)*/

        await logupdate(pkTextDiv.innerHTML,battleresult,enemyname,echar,echarlv);
        if(echar=="野怪"){return}
        if(mainHost!="0"){
            get_user_theard(enemyname);
        }

    });

    async function logupdate(etext,isbattlewin,enemyname,enemychar,enemycharlv){
        var now = getLocDate();
        var thisid = md5(etext)

        await db.battleLog.add({id:thisid,username:user,log:etext, isWin:isbattlewin,enemyname:enemyname,char:enemychar,charlevel:enemycharlv,time:now});
    }

    async function logupdateraw(etext,isbattlewin,enemyname,enemychar,enemycharlv,now,username){
        var thisid = md5(etext)

        await db.battleLog.add({id:thisid,username:username,log:etext, isWin:isbattlewin,enemyname:enemyname,char:enemychar,charlevel:enemycharlv,time:now});
    }

    function save_enemylevel(name,level){
        var a = BattleLog["enemylevel"]
        if(a===undefined){
            BattleLog["enemylevel"]={};
            a = BattleLog["enemylevel"]
        }
        a[name]=level;
        FM_setValue("BattleLog",BattleLog)
    }

    function get_enemylevel(name){
        if(name.indexOf("ikarosf")!=-1){return "114"}
        var a = BattleLog["enemylevel"]
        if(a===undefined){
            return "";
        }
        if(name in a){
            return a[name];
        }
        return ""
    }

    function dosmalldiv(){
        if($(".smalldiv").css("display")=="none"){
            $("#goxpanel").css("min-width","280px")
            $("#goxpanel").css("width","20%")
            $("#smallbar").text("<")
            localStorage.setItem("smalldiv","false")
        }else{
            $("#goxpanel").css("min-width","unset")
            $("#goxpanel").css("width","50px")
            $("#smallbar").text(">")
            $("#goxpanelExtend").hide();
            localStorage.setItem("smalldiv","true")
        }
        $(".smalldiv").toggle();
    }

    function loadv(){
        if(localStorage.getItem("smalldiv")=="true"){
            dosmalldiv()
        }
    }

    async function autodeletelog(dayss){
        var during_s = dayss * 24 * 60 * 60 * 1000
        var now = getLocDate()
        var old = new Date(now - during_s)
        await db.battleLog.where("time").belowOrEqual(old).and(item => item.username == user).delete()
    }

    async function count_battle(during){
        var during_s = during * 24 * 60 * 60 * 1000
        var now = getLocDate()
        var old = new Date(now - during_s)

        var battlelog = await db.battleLog.where("time").between(old,now,true,true).and(item => item.username == user).toArray()

        var enemy_sum = {};
        for(var log of battlelog){
            var name = log.enemyname;
            var isWin = log.isWin;
            var a = enemy_sum[name];
            if(a==undefined){//该对手第一次出现
                enemy_sum[name] = [1,isWin===true?1:0,isWin===false?1:0,[getDateString(log.time)]]; //[总场次，胜场，败场，时间]
            }else{
                enemy_sum[name][0]++;
                enemy_sum[name][1]+=isWin===true?1:0;
                enemy_sum[name][2]+=isWin===false?1:0;
                enemy_sum[name][3].push(getDateString(log.time));
            }
        }
        var listSort = Object.keys(enemy_sum).sort(function(a,b){ return enemy_sum[b][0]-enemy_sum[a][0]; });

        return [enemy_sum,listSort];
    }

    function init_table(){
        var table_html = '<canvas id="battleCountChart"></canvas>'
        var obj = document.createElement("div");
        obj.innerHTML = table_html;
        obj.setAttribute('id','chartParent');
        $("body")[0].appendChild(obj);
        chartssize(obj,ctx)
    }

    async function table_date_set(during,num){
        var count_result = await count_battle(during)
        var enemy_sum = count_result[0];
        var enemy_sum_top_list = count_result[1].slice(0, num)
        var wincount_list = [],losecount_list = [],tiecount_list = []
        for(var enemy_sum_top_item in enemy_sum_top_list){
            wincount_list.push(enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][1])
            losecount_list.push(enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][2])
            tiecount_list.push(enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][0]-enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][1]-enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][2])
        }

        $('#battleCountChart').remove();
        $('#chartParent').append('<canvas id="battleCountChart"></canvas>');
        var ctx = document.getElementById("battleCountChart")
        ctx.style.backgroundColor = 'rgba(250,250,250,150)';

        var linedata = {
            labels: enemy_sum_top_list,
            datasets: [{
                type: 'bar',
                data: losecount_list,
                backgroundColor: "#ea8c7c"
            },{
                type: 'bar',
                data: wincount_list,
                backgroundColor: "#7fe6ef"
            },{
                type: 'bar',
                data: tiecount_list,
                backgroundColor: "#DCDCDC"
            }]
        };

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: linedata,
            options: {
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero:true,
                            stepSize: 1
                        }
                    }]
                },
                responsive:true,
                maintainAspectRatio: false,
                title:{
                    display:true,
                    text:'遇到最多的人TOP' + num,
                    fontSize:25
                },
                legend: {
                    display: false,

                },
                tooltips: {
                    intersect:false,
                    displayColors:false,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var enemy_name = tooltipItem.label
                            var battle_sum = enemy_sum[enemy_name][0]
                            var win_sum = enemy_sum[enemy_name][1]

                            var label = ["战斗次数："+battle_sum , "获胜次数："+win_sum, "战斗日期：↓"];
                            for(var i in enemy_sum[enemy_name][3]){
                                label.push("  " + enemy_sum[enemy_name][3][i])
                            }
                            return label;
                        }
                    }
                }
            }
        });
    }

    function get_safeid(){
        return getPostData(/gox\(\)\{[\s\S]*\}/m,/data: ".*"/).slice(-7,-1);
    }
    function getPostData(p1,p2){
        let data = -1;
        for(let s of document.getElementsByTagName('script')){
            let func = s.innerText.match(p1)
            if(func!=null){
                data = func[0].match(p2)[0];
                break;
            }
        }
        return data
    }

    function dbInit(){
        db.version(1).stores({
            battleLog: "id,time,username"
        });
    }

    async function transToDbdata(){
        for (var i in BattleLog){
            if(i != "enemylevel"){
                delete BattleLog[i];
            }
        }
        FM_setValue("BattleLog",BattleLog)

        var flag = await Dexie.exists("ggzharvester");
        if(flag){
            alert("即将开始将战斗记录数据格式更新至新版本\n可能会花费一点时间，请稍等且不要关闭网页");
            var dbold = new Dexie("ggzharvester");
            dbold.version(1).stores({
                battleLog: "++id,time,username"
            });
            await dbold.battleLog
                .each(async logline => {
                await logupdateraw(logline.log,logline.isWin,logline.enemyname,logline.char,logline.charlevel,logline.time,logline.username)
            });
            await dbold.delete()
            alert("数据更新完毕！");
        }
    }

    async function getDaysOfLog(){
        var result = new Set()
        await db.battleLog.where({username:user}).each(item => result.add(getDateString(item.time)))

        return Array.from(result);
    }

    //——————————————————mainfun————————————
    unsafeWindow.get_user_theard = get_user_theard;
    unsafeWindow.pklist = mypklist;
    setTimeout(banbattletypefunc,"1000");
    read_rank();
    setInterval(read_rank,"1000");
    observerBody1.observe(document.querySelector("#pk_text"), {characterData: true,childList: true});
    mycss();
    await initgoxpanel();
    init_table();

    //autodeletelog(30);
    loadv();
}

function dictsort(dic){
    var res = Object.keys(dic).sort(function(a,b){return b-a;});
    for(var key in res){
        console.log("key: " + res[key] + " ,value: " + dic[res[key]].score);
    }
}

Function.prototype.getMultilines = function () {
    var lines = new String(this);
    lines = lines.substring(lines.indexOf("/*") + 2,lines.lastIndexOf("*/"));
    return lines;
}
String.format = function(src){
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};

function FM_setValue(name, value){
    var oldvalue = GM_getValue(user);
    if(oldvalue === undefined){
        oldvalue = {};}
    oldvalue[name] = value;
    GM_setValue(user,oldvalue);
}

function FM_getValue(name, defaultValue){
    var thisvalue = GM_getValue(user);
    if(thisvalue != undefined&&name in thisvalue){
        return thisvalue[name]
    }
    if(defaultValue != null){
        return defaultValue;
    }
    return null;
}

function html_encode(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br/>");
    return s;
}

function html_decode(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br\/>/g, "\n");
    return s;
}

function getLocDate(aparam){//不传参，返回当前时间的Date变量;该方法用来代替new Date
    var thisDate;
    if (typeof(aparam) == "undefined") {
        thisDate = new Date();
    }else{
        thisDate = new Date(aparam)
    }
    //本地时间 + 本地时间与格林威治时间的时间差 + GMT+8与格林威治的时间差
    return new Date(thisDate.getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000)
}

function getLocDay(){//返回当前日期的Date变量
    var daystr = getDateString(getLocDate())
    return new Date(new Date(daystr).getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000)
}

function getDateString(thisDate){//将传入的时间戳转换为年月日字符串
    return thisDate.getFullYear() + "/" + (thisDate.getMonth()+1) + "/" + thisDate.getDate()
}

function getNowtime(){
    var date=getLocDate();
    var datetext = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    return datetext;
}

//参数container为图表盒子节点.charts为图表节点
function chartssize (container,charts) {
    function getStyle(el, name) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(el, null);
        } else {
            return el.currentStyle;
        }
    }
    var wi = getStyle(container, 'width').width;
    var hi = getStyle(container, 'height').height;
    charts.style.width = wi
    charts.style.height = hi
}

function formatStringLen(strVal, len, padChar){
    padChar = padChar || "*";
    if (!strVal) {
        return padChar.repeat(len);
    } else {
        const strLen = strVal.gblen();
        if (strLen > len){
            return strVal.substring(0, len);
        } else if (strLen < len){
            let mylen = len - strLen;
            return strVal + padChar.repeat(mylen);
        }else{
            return strVal;
        }
    }
}

String.prototype.gblen = function() {
    var len = 0;
    for (var i=0; i<this.length; i++) {
        if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {
            len += 2;
        } else {
            len ++;
        }
    }
    return len;
}

function download(downfile,name) {
    const tmpLink = document.createElement("a");
    const objectUrl = URL.createObjectURL(downfile);
    tmpLink.href = objectUrl;
    tmpLink.download = name;
    tmpLink.click();
    URL.revokeObjectURL(objectUrl);
}

var sleep = (ms) => {
    // Unit is ms
    return new Promise(resolve => setTimeout(resolve, ms))
}

(function(o) {    "use strict";    "function" == typeof define && define.amd ? define(["jquery"], o) : o(jQuery)})(function(o) {    var t, i = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], e = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], n = new Date, p = n.getFullYear(), l = n.getMonth(), a = n.getDate(), u = n.getHours(), v = n.getMinutes(), s = null, r = {        type: "date",        background: "#494a4a"    }, c = !1;    o.extend(o.fn, {        datetime: function(d) {            return this.each(function() {                function h() {                    var t = o('<div class="dateTimeWrap"><div class="datePart"><div class="dateTimeHead"><span year="2019" month="7" id="dateTime"><select class="year" name="yearSelect" id="yearSelect"><option value="1920">1920年</option><option value="1921">1921年</option><option value="1922">1922年</option><option value="1923">1923年</option><option value="1924">1924年</option><option value="1925">1925年</option><option value="1926">1926年</option><option value="1927">1927年</option><option value="1928">1928年</option><option value="1929">1929年</option><option value="1930">1930年</option><option value="1931">1931年</option><option value="1932">1932年</option><option value="1933">1933年</option><option value="1934">1934年</option><option value="1935">1935年</option><option value="1936">1936年</option><option value="1937">1937年</option><option value="1938">1938年</option><option value="1939">1939年</option><option value="1940">1940年</option><option value="1941">1941年</option><option value="1942">1942年</option><option value="1943">1943年</option><option value="1944">1944年</option><option value="1945">1945年</option><option value="1946">1946年</option><option value="1947">1947年</option><option value="1948">1948年</option><option value="1949">1949年</option><option value="1950">1950年</option><option value="1951">1951年</option><option value="1952">1952年</option><option value="1953">1953年</option><option value="1954">1954年</option><option value="1955">1955年</option><option value="1956">1956年</option><option value="1957">1957年</option><option value="1958">1958年</option><option value="1959">1959年</option><option value="1960">1960年</option><option value="1961">1961年</option><option value="1962">1962年</option><option value="1963">1963年</option><option value="1964">1964年</option><option value="1965">1965年</option><option value="1966">1966年</option><option value="1967">1967年</option><option value="1968">1968年</option><option value="1969">1969年</option><option value="1970">1970年</option><option value="1971">1971年</option><option value="1972">1972年</option><option value="1973">1973年</option><option value="1974">1974年</option><option value="1975">1975年</option><option value="1976">1976年</option><option value="1977">1977年</option><option value="1978">1978年</option><option value="1979">1979年</option><option value="1980">1980年</option><option value="1981">1981年</option><option value="1982">1982年</option><option value="1983">1983年</option><option value="1984">1984年</option><option value="1985">1985年</option><option value="1986">1986年</option><option value="1987">1987年</option><option value="1988">1988年</option><option value="1989">1989年</option><option value="1990">1990年</option><option value="1991">1991年</option><option value="1992">1992年</option><option value="1993">1993年</option><option value="1994">1994年</option><option value="1995">1995年</option><option value="1996">1996年</option><option value="1997">1997年</option><option value="1998">1998年</option><option value="1999">1999年</option><option value="2000">2000年</option><option value="2001">2001年</option><option value="2002">2002年</option><option value="2003">2003年</option><option value="2004">2004年</option><option value="2005">2005年</option><option value="2006">2006年</option><option value="2007">2007年</option><option value="2008">2008年</option><option value="2009">2009年</option><option value="2010">2010年</option><option value="2011">2011年</option><option value="2012">2012年</option><option value="2013">2013年</option><option value="2014">2014年</option><option value="2015">2015年</option><option value="2016">2016年</option><option value="2017">2017年</option><option value="2018">2018年</option><option value="2019">2019年</option><option value="2020">2020年</option><option value="2021">2021年</option><option value="2022">2022年</option><option value="2023">2023年</option><option value="2024">2024年</option><option value="2025">2025年</option><option value="2026">2026年</option><option value="2027">2027年</option><option value="2028">2028年</option><option value="2029">2029年</option><option value="2030">2030年</option><option value="2031">2031年</option><option value="2032">2032年</option><option value="2033">2033年</option><option value="2034">2034年</option><option value="2035">2035年</option><option value="2036">2036年</option><option value="2037">2037年</option><option value="2038">2038年</option><option value="2039">2039年</option><option value="2040">2040年</option><option value="2041">2041年</option><option value="2042">2042年</option><option value="2043">2043年</option><option value="2044">2044年</option><option value="2045">2045年</option><option value="2046">2046年</option><option value="2047">2047年</option><option value="2048">2048年</option><option value="2049">2049年</option><option value="2050">2050年</option></select><select class="month" name="monthSelect" id="monthSelect"><option value="0">一月</option><option value="1">二月</option><option value="2">三月</option><option value="3">四月</option><option value="4">五月</option><option value="5">六月</option><option value="6">七月</option><option value="7">八月</option><option value="8">九月</option><option value="9">十月</option><option value="10">十一月</option><option value="11">十二月</option></select></span><div class="changeMonth"><span id="pre"><</span> <span id="next">></span></div></div><div><ul><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul id="dayDat"></ul></div><div class="dateTimeFoot"><span class="selTime">选择时间</span><span id="close">关闭</span><span id="selcurday">今天</span></div></div><div class="timePart" style="display:none"><ul><li id="selHour"><p>时</p><ol></ol></li><li id="selMinute"><p>分</p><ol></ol></li></ul><div class="timeFooter"><span class="selTime">选择日期</span><span id="ensure">确定</span><span id="curTime">当前时间</span></div></div></div>');                    o("body").append(t),                        c = !0                }                function m(o, t) {                    var i = new Date(t,o,1);                    return i.getDay()                }                function f(o, t) {                    var n = t % 4                    , p = t % 100                    , l = t % 400;                    return 0 == n && 0 != p || 0 == l ? i[o] : e[o]                }                function g() {                    var activedate = o.extend(!0, {}, r, d).active;                    var t = ""                    , i = f(l, p);                    a > i && (a = i);                    for (var e, n = m(l, p), u = 0; u < n; u++)                        t += "<li></li>";                    for (u = 1; u <= i; u++){                        var thisdatestring = p+"/"+(l+1)+"/"+u;                        if(activedate.includes(thisdatestring)){                            e = u == a ? 'curDay' : "",                                t += '<li class="active ' + e + '">' + u + "</li>";                        }else{                            e = u == a ? 'curDay' : "",                                t += '<li class="inactive ' + e + '">' + u + "</li>";                        }                    }                    o("#dayDat").html(t)                }                function y() {                    for (var t = "", i = "", e = 0; e < 24; e++)                        e < 10 && (e = "0" + e),                            t += e == u ? "<li class='cur'>" + e + "</li>" : "<li>" + e + "</li>";                    for (e = 0; e < 60; e++)                        e < 10 && (e = "0" + e),                            i += e == v ? "<li class='cur'>" + e + "</li>" : "<li>" + e + "</li>";                    o("#selHour ol").html(t),                        o("#selMinute ol").html(i)                }                function T() {                    o(".dateTimeWrap").show();                    var i = t.type;                    if ("date" != i) {                        y(),                            o(".datePart").hide().siblings(".timePart").show();                        var e = o("#selHour .cur");                        o("#selHour ol").scrollTop(e.offset().top - o("#selHour ol").offset().top + o("#selHour ol").scrollTop() - e.outerHeight());                        var n = o("#selMinute .cur");                        o("#selMinute ol").scrollTop(n.offset().top - o("#selMinute ol").offset().top + o("#selMinute ol").scrollTop() - n.outerHeight())                    }                    "time" != i && (g(),                                    o(".datePart").show().siblings(".timePart").hide(),                                    o("#yearSelect").val(p),                                    o("#monthSelect").val(l)),                        "datetime" == i ? o(".selTime").show() : o(".selTime").hide()                }                function M() {                    var o = t.type                    , i = t.value                    , e = !0;                    return i && i.length > 0 && ("datetime" == o && (5 != i.length || i[0] > 2050 || i[0] < 1920 || i[1] > 12 || i[1] < 1 || i[2] > 31 || i[2] < 1 || i[3] > 23 || i[3] < 1 || i[4] > 59 || i[4] < 1) && (e = !1),                                                 "date" == o && (3 != i.length || i[0] > 2050 || i[0] < 1920 || i[1] > 12 || i[1] < 1 || i[2] > 31 || i[2] < 1) && (e = !1),                                                 "time" == o && (2 != i.length || i[0] > 23 || i[0] < 1 || i[1] > 59 || i[1] < 1) && (e = !1)),                        e                }                function P() {                    var i, e, n = t.type;                    (i = "date" == n ? p + "-" + (parseInt(l) + 1) + "-" + a : "time" == n ? u + ":" + v : p + "-" + (parseInt(l) + 1) + "-" + a + " " + u + ":" + v,                     s.val(i),                     o(".dateTimeWrap").hide(),                     t.success && "function" == typeof t.success) && (e = "date" == n ? p+"/"+(parseInt(l) + 1)+"/"+parseInt(a) : "time" == n ? [u, v] : [p+"/"+( parseInt(l) + 1)+ parseInt(a)+"/"+u+"/"+v],                                                                      t.success(e))                }                var S = o(this);                t = o.extend(!0, {}, r, d),                    c || h(),                    o("#selcurday,#close,#dayDat,.changeMonth span,.selTime").unbind("click"),                    o("#yearSelect,#monthSelect").unbind("change"),                    o("#yearSelect,#monthSelect").change(function() {                    l = o("#monthSelect").val(),                        p = o("#yearSelect").val(),                        g()                }),                    o(".changeMonth span").click(function() {                    "pre" == this.id ? (l -= 1,                                        -1 == l && (l = 11,                                                    p -= 1)) : (l += 1,                                                                12 == l && (l = 0,                                                                            p += 1)),                        g(),                        o("#yearSelect").val(p),                        o("#monthSelect").val(l)                }),                    o("#selcurday").click(function() {                    var i = new Date;                    p = i.getFullYear(),                        l = i.getMonth(),                        a = i.getDate(),                        g(),                        o("#yearSelect").val(p),                        o("#monthSelect").val(l),                        "datetime" != t.type ? P() : o(".datePart").hide().siblings(".timePart").show()                }),                    o("#close").click(function() {                    o(".dateTimeWrap").hide()                }),                    o("#dayDat").on("click", ".active", function() {                    a = o(this).html(),                        "datetime" != t.type ? P() : o(".datePart").hide().siblings(".timePart").show()                }),                    o(".selTime").click(function() {                    "选择时间" == o(this).html() ? o(".datePart").hide().siblings(".timePart").show() : o(".datePart").show().siblings(".timePart").hide()                }),                    o(".timePart ol,.timeFooter #ensure,.timeFooter #curTime").unbind("click"),                    o(".timePart ol").on("click", "li", function() {                    o(this).addClass("cur").siblings("li").removeClass("cur");                    var t = o(this).parent();                    t.animate({                        scrollTop: o(this).offset().top - t.offset().top + t.scrollTop() - o(this).outerHeight()                    }, 100)                }),                    o(".timeFooter #ensure").click(function() {                    u = o("#selHour ol .cur").html(),                        v = o("#selMinute ol .cur").html(),                        P(),                        o(".dateTimeWrap").hide()                }),                    o(".timeFooter #curTime").click(function() {                    u = n.getHours(),                        v = n.getMinutes(),                        parseInt(u) < 10 && (u = "0" + u),                        parseInt(v) < 10 && (v = "0" + v),                        y(u, v),                        P()                }),                    S.click(function() {                    if (t = o.extend(!0, {}, r, d),                        !M())                        return alert("参数错误"),                            !1;                    var i = this.value;                    if (i) {                        i = i.replace(/-/g, "/");                        var e = new Date(i)                        }                    "date" == t.type ? this.value ? (l = e.getMonth(),                                                     p = e.getFullYear(),                                                     a = e.getDate()) : (l = t.value[1] - 1,                                                                         p = t.value[0],                                                                         a = t.value[2]) : "time" == t.type ? this.value ? (u = this.value.split(":")[0],                                                                                                                            v = this.value.split(":")[1]) : (v = t.value[1],                    u = t.value[0]) : this.value ? (l = e.getMonth(),                                                    p = e.getFullYear(),                                                    a = e.getDate(),                                                    u = e.getHours(),                                                    v = e.getMinutes()) : (l = t.value[1] - 1,                                                                           p = t.value[0],                                                                           a = t.value[2],                                                                           v = t.value[4],                                                                           u = t.value[3]),                        s = o(this),                        T();                    var n = S.offset().left                    , c = S.offset().top - 4*S.outerHeight();                    o(".dateTimeWrap").css({                        background: t.background,                        top: c,                        left: n                    })                })            }),                this        }    })});
var gslientaudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjcxLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABVgANTU1NTU1Q0NDQ0NDUFBQUFBQXl5eXl5ea2tra2tra3l5eXl5eYaGhoaGhpSUlJSUlKGhoaGhoaGvr6+vr6+8vLy8vLzKysrKysrX19fX19fX5eXl5eXl8vLy8vLy////////AAAAAExhdmM1Ny44OQAAAAAAAAAAAAAAACQCgAAAAAAAAAVY82AhbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAALACwAAP/AADwQKVE9YWDGPkQWpT66yk4+zIiYPoTUaT3tnU487uNhOvEmQDaCm1Yz1c6DPjbs6zdZVBk0pdGpMzxF/+MYxA8L0DU0AP+0ANkwmYaAMkOKDDjmYoMtwNMyDxMzDHE/MEsLow9AtDnBlQgDhTx+Eye0GgMHoCyDC8gUswJcMVMABBGj/+MYxBoK4DVpQP8iAtVmDk7LPgi8wvDzI4/MWAwK1T7rxOQwtsItMMQBazAowc4wZMC5MF4AeQAGDpruNuMEzyfjLBJhACU+/+MYxCkJ4DVcAP8MAO9J9THVg6oxRMGNMIqCCTAEwzwwBkINOPAs/iwjgBnMepYyId0PhWo+80PXMVsBFzD/AiwwfcKGMEJB/+MYxDwKKDVkAP8eAF8wMwIxMlpU/OaDPLpNKkEw4dRoBh6qP2FC8jCJQFcweQIPMHOBtTBoAVcwOoCNMYDI0u0Dd8ANTIsy/+MYxE4KUDVsAP8eAFBVpgVVPjdGeTEWQr0wdcDtMCeBgDBkgRgwFYB7Pv/zqx0yQQMCCgKNgonHKj6RRVkxM0GwML0AhDAN/+MYxF8KCDVwAP8MAIHZMDDA3DArAQo3K+TF5WOBDQw0lgcKQUJxhT5sxRcwQQI+EIPWMA7AVBoTABgTgzfBN+ajn3c0lZMe/+MYxHEJyDV0AP7MAA4eEwsqP/PDmzC/gNcwXUGaMBVBIwMEsmB6gaxhVuGkpoqMZMQjooTBwM0+S8FTMC0BcjBTgPwwOQDm/+MYxIQKKDV4AP8WADAzAKQwI4CGPhWOEwCFAiBAYQnQMT+uwXUeGzjBWQVkwTcENMBzA2zAGgFEJfSPkPSZzPXgqFy2h0xB/+MYxJYJCDV8AP7WAE0+7kK7MQrATDAvQRIwOADKMBuA9TAYQNM3AiOSPjGxowgHMKFGcBNMQU1FMy45OS41VVU/31eYM4sK/+MYxKwJaDV8AP7SAI4y1Yq0MmOIADGwBZwwlgIJMztCM0qU5TQPG/MSkn8yEROzCdAxECVMQU1FMy45OS41VTe7Ohk+Pqcx/+MYxMEJMDWAAP6MADVLDFUx+4J6Mq7NsjN2zXo8V5fjVJCXNOhwM0vTCDAxFpMYYQU+RlVMQU1FMy45OS41VVVVVVVVVVVV/+MYxNcJADWAAP7EAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxOsJwDWEAP7SAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxPMLoDV8AP+eAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxPQL0DVcAP+0AFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
gslientaudio.loop = true;
gslientaudio.play();
//gslientaudio.pause();
//gslientaudio.remove();
//——————————————————mainfun————————————
var user = $("button[class*='btn btn-lg'][onclick*='fyg_index.php']")[0].innerText;
let dateTimecss = GM_getResourceText('dateTimecss')
GM_addStyle(dateTimecss)

var rl = window.location.href;
//if(/guguzhen.com\/fyg_pk.php/.test(rl)){
fyg_pk_html();
//}


unsafeWindow.GM_getValue = GM_getValue
unsafeWindow.FM_setValue = FM_setValue
unsafeWindow.GM_listValues = GM_listValues
unsafeWindow.getLocDate = getLocDate