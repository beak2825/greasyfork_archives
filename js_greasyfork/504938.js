// ==UserScript==
// @name         锁帖辅助
// @namespace    https://sstm.moe/
// @version      0.2
// @description  一键锁帖
// @author       367ddd(叫我牛顿吧)
// @match        https://sstm.moe/forum/*
// @license MIT
// @icon     https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504938/%E9%94%81%E5%B8%96%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/504938/%E9%94%81%E5%B8%96%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //思路:每次运行最多提交30页，利用cookie存储当前是否在运行态，以及当前该从何处运行,设置cookie达到版区隔离的效果
    var setint;
    let allpages=parseInt($('li.ipsPagination_last>a').attr('data-page'));
    let inpage=1;
    let outpage=1;
    let areaid=$('body').attr('data-pageid');
    console.log('当前版区id：'+areaid);
    let endpage=allpages;
    let locking=0;
    let uploadmonths=1200;
    let lastmonths=1;
    let topskip =1;
    let positiveskip=1;
    let hiddenskip=1;
    let allnums=0;
    if(getCookie('sstmlockbegin')===false){setCookie('sstmlockbegin',1);}else{inpage=getCookie('sstmlockbegin');outpage=inpage;}
    if(getCookie('sstmlockend')===false){setCookie('sstmlockend',1);}else{endpage=(getCookie('sstmlockend')>(inpage+29))?(inpage+29):getCookie('sstmlockend');}
    if(getCookie('sstmlocking')===false){setCookie('sstmlocking',0);}else{locking=getCookie('sstmlocking')}
    if(getCookie('sstmuploadmonths')===false){setCookie('sstmuploadmonths',1200);}else{ uploadmonths=getCookie('sstmuploadmonths')}
    if(getCookie('sstmlastmonths')===false){setCookie('sstmlastmonths',1);}else{ lastmonths=getCookie('sstmlastmonths')}
    if(getCookie('sstmtopskip')===false){setCookie('sstmtopskip',1);}else{ topskip=getCookie('sstmtopskip')}
    if(getCookie('sstmpositiveskip')===false){setCookie('sstmpositiveskip',1);}else{ positiveskip=getCookie('sstmpositiveskip')}
    if(getCookie('sstmhiddenskip')===false){setCookie('sstmhiddenskip',1);}else{ hiddenskip=getCookie('sstmhiddenskip')}
    if(getCookie('sstmareaid')===false){setCookie('sstmareaid',areaid);}
    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return parseInt(c.substring(name.length,c.length));
        }
        return false;
    }
    function setCookie(cname,cvalue)
    {
        console.log('cookies:'+cname+':'+cvalue);
        document.cookie = cname + "=" + cvalue + "; path="+$('link[rel="canonical"]')[0].href.substring($('link[rel="canonical"]')[0].href.indexOf('/forum'),$('link[rel="canonical"]')[0].href.length);
    }
    function settingsubmit(){
        console.log('settingsubmit');
        setCookie('sstmlockbegin',$('#beginpage')[0].value);
        setCookie('sstmlockend',$('#endpage')[0].value);
        setCookie('sstmlocking',1);
        setCookie('sstmuploadmonths',$('#uploadmonths')[0].value);
        setCookie('sstmlastmonths',$('#lastmonths')[0].value);
        setCookie('sstmtopskip',$('#topskip')[0].checked*1);
        setCookie('sstmpositiveskip',$('#positiveskip')[0].checked*1);
        setCookie('sstmhiddenskip',$('#hiddenskip')[0].checked*1);
        setCookie('sstmareaid',areaid);
        inpage=parseInt($('#beginpage')[0].value);outpage=inpage;
        endpage=parseInt($('#endpage')[0].value)>(inpage+29)?(inpage+29):parseInt($('#endpage')[0].value);
        uploadmonths=parseInt($('#uploadmonths')[0].value);
        lastmonths=parseInt($('#lastmonths')[0].value);
        topskip=$('#topskip')[0].checked*1;
        positiveskip=$('#positiveskip')[0].checked*1;
        hiddenskip=$('#hiddenskip')[0].checked*1;
        locking=1;
    }
    function initareasetting(){
        switch(areaid){
            case 6:
                $('#beginpage')[0].value=inpage;
                $('#endpage')[0].value=getCookie('sstmlockend');
                $('#uploadmonths')[0].value=1200;
                $('#lastmonths')[0].value=2;
                $('#topskip')[0].checked=true;
                $('#positiveskip')[0].checked=true;
                $('#hiddenskip')[0].checked=true;
                break;
            case 12:
                $('#beginpage')[0].value=inpage;
                $('#endpage')[0].value=getCookie('sstmlockend');
                $('#uploadmonths')[0].value=1;
                $('#lastmonths')[0].value=1;
                $('#topskip')[0].checked=true;
                $('#positiveskip')[0].checked=true;
                $('#hiddenskip')[0].checked=true;
                break;
            case 25:
                $('#beginpage')[0].value=inpage;
                $('#endpage')[0].value=getCookie('sstmlockend');
                $('#uploadmonths')[0].value=1200;
                $('#lastmonths')[0].value=3;
                $('#topskip')[0].checked=true;
                $('#positiveskip')[0].checked=true;
                $('#hiddenskip')[0].checked=true;
                break;
            case 74:
                $('#beginpage')[0].value=inpage;
                $('#endpage')[0].value=getCookie('sstmlockend');
                $('#uploadmonths')[0].value=5;
                $('#lastmonths')[0].value=1;
                $('#topskip')[0].checked=topskip;
                $('#positiveskip')[0].checked=positiveskip;
                $('#hiddenskip')[0].checked=hiddenskip;
                break;
            default:
                $('#beginpage')[0].value=inpage;
                $('#endpage')[0].value=getCookie('sstmlockend');
                $('#uploadmonths')[0].value=uploadmonths;
                $('#lastmonths')[0].value=lastmonths;
                $('#topskip')[0].checked=topskip;
                $('#positiveskip')[0].checked=positiveskip;
                $('#hiddenskip')[0].checked=hiddenskip;
                break;
        }
    }
    function searchgrave(page){
        // 创建一个新的XMLHttpRequest对象
        if(page>allpages){return}
        var xhr = new XMLHttpRequest();
        var doc = null;
        // 配置HTTP请求
        xhr.open('GET', 'https://sstm.moe/forum/'+areaid+'-*/page/'+page+'/', true);
        // 设置请求完成的处理函数
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // 请求成功，处理响应
                var response = this.response;
                // 解析HTML为DOM
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                // 现在你可以使用doc作为Document对象来操作DOM
                //console.log(doc.title); // 打印网页的标题
                if(doc==null){console.error()}
                //var areaname=$(doc).find('[data-role="breadcrumbList"]>li')[2].innerText.trim()
                var topics=$(doc).find('ol[data-role="tableRows"]>li.ipsDataItem')
                var nowtime=new Date()
                var nums=0
                for(let i=0;i<topics.length;i++){
                    let skip=false;
                    let lockthis=false;
                    let lock=$(topics[i]).find('.fa-lock').length
                    let top =$(topics[i]).find('.fa-thumb-tack').length
                    let positive=$(topics[i]).find('.ipsBadge_positive').length
                    let hide=$(topics[i]).find('.fa-eye-slash').length
                    let left=$(topics[i]).find('.fa-arrow-left').length
                    if(lock+left+top*topskip+positive*positiveskip+hide*hiddenskip>0){skip=true;}
                    if(areaid==12&&$(topics[i]).find('a>span>span.ipsBadge')[0].innerText.includes('一般区资源')){skip=true;}
                    if(skip===true){//跳过筛选
                        //console.log(topics[i].getAttribute('data-rowid'))
                        console.log('已跳过锁定/置顶/精华/隐藏/移动')
                        continue;
                    }
                    let lasttime =new Date($(topics[i]).find('time')[1].getAttribute('datetime'));
                    let uploadtime =new Date($(topics[i]).find('time')[0].getAttribute('datetime'));
                    let lasthours=Math.floor((nowtime-lasttime)/3600000);
                    let uploadhours=Math.floor((nowtime-uploadtime)/3600000);
                    let lastdays= Math.floor(lasthours/24);
                    let uploaddays =Math.floor(uploadhours/24);
                    let lastmonth =Math.floor(lastdays/30);
                    let uploadmonth =Math.floor(uploaddays/30);
                    //console.log('last:'+lastmonths+'upload:'+updatemonths)
                    if(lastmonth>=lastmonths||uploadmonth>=uploadmonths){lockthis=true}
                    if(lockthis===true){
                        $(doc).find('input[name="moderate['+topics[i].getAttribute("data-rowid")+']"]').checked=true
                        let temp='<input type="checkbox" id="addedcheckbox'+topics[i].getAttribute("data-rowid")+'"data-role="moderation" name="moderate['+topics[i].getAttribute("data-rowid")+']" data-actions="feature pin hide unlock lock move merge delete" data-state="unhidden unread locked" >'
                        $(temp).insertBefore($('form[data-role="moderationTools"]').find('input[type="checkbox"]')[0])
                        $('#addedcheckbox'+topics[i].getAttribute("data-rowid"))[0].checked=true
                        nums++;
                        allnums++;
                        console.log('坟：'+topics[i].getAttribute('data-rowid'))
                        window.localStorage.topics+=topics[i].getAttribute('data-rowid')
                    }
                }
                inpage=page+1
                if(nums>0){
                    console.log('find!')
                }else{
                    return
                }
            } else {
                // 请求失败，处理错误
                console.error(this.statusText);
            }
        };
        // 发送XHR请求
        xhr.send();
    }
    function uiinsert(){
        let ui='<div class="ipsButtonBar ipsPad_half ipsClearfix ipsClear" id="mysetting"style="height:50px;">'
        ui+='<button id="mystartbutton" style="margin-right: 5px;border-radius: 4px;background-color: palegreen;height: 25px;">开始锁帖</button>';
        ui+='开始页码：';
        ui+='<input id="beginpage" style="width:40px;margin-right: 5px;">';
        ui+='终止页码：';
        ui+='<input id="endpage" style="width:40px;margin-right: 5px;">';
        ui+='最后回复月数：';
        ui+='<input id="lastmonths" style="width:40px;margin-right: 5px;">';
        ui+='发布月数：';
        ui+='<input id="uploadmonths" style="width:40px;margin-right: 5px;">';
        ui+='跳过置顶：';
        ui+='<input id="topskip" type="checkbox" style="margin-right: 5px;">';
        ui+='跳过精华：';
        ui+='<input id="positiveskip" type="checkbox" style="margin-right: 5px;">';
        ui+='跳过隐藏：';
        ui+='<input id="hiddenskip" type="checkbox" style="margin-right: 5px;">';
        ui+='</div>';
        $(ui).insertBefore($('form[data-role="moderationTools"]')[0]);
        $('#mystartbutton')[0].addEventListener("click",function(){
            if($('#beginpage')[0].value<0||$('#beginpage')[0].value>$('#endpage')[0].value||$('#endpage')[0].value>allpages){
                alert('有数值不合规，请重新输入');
                return;
            }
            settingsubmit();
            $('#mysetting')[0].remove();
            startlock();
        })
        initareasetting();
    }
    if($('form[data-role="moderationTools"]').find('input[type="checkbox"]').length==0){
        console.log('锁帖辅助：本版区无权限');
        return;
    }
    if(areaid==44||areaid==28||areaid==18||areaid==55){
        console.log('锁帖辅助：版区已汇报不需要');
        return;
    }
    if(locking!=0){
        startlock();
    }else{
        console.log('开始插入锁帖ui');
        uiinsert();
    }
    function interrupt(){
        setCookie('sstmlocking',0);
        location.reload();
    }
    function startlock(){
        console.log('运行中，设置ui隐藏以防误操作');
        let ui='<div class="ipsButtonBar ipsPad_half ipsClearfix ipsClear" style="height:50px;">';
        ui+='<button id="myinterruptbutton" style="margin-right: 5px;border-radius: 4px;background-color: red;height: 25px;">中止锁帖</button>';
        ui+='当前页数：';
        ui+='<input readonly="readonly" id="lockingpage" style="width:40px;margin-right: 5px;">';
        ui+='当前执行版区ID：';
        ui+='<input readonly="readonly" id="lockingarea" style="width:40px;margin-right: 5px;">';
        ui+='</div>';
        $(ui).insertBefore($('form[data-role="moderationTools"]')[0]);
        $('#myinterruptbutton')[0].addEventListener("click",function(){
            interrupt();
        })
        areaid=getCookie('sstmareaid');
        $('#lockingarea')[0].value=areaid;
        setint= setInterval(function(){
            if(inpage>endpage){
                clearInterval(setint);
                $('form[data-role="moderationTools"]>div>div>select')[0].value='lock';
                setCookie('sstmlockbegin',endpage+1);
                if(inpage>getCookie('sstmlockend')){
                    setCookie('sstmlockbegin',1);
                    setCookie('sstmlocking',0);
                    alert('自动锁帖到达终点');
                }
                if(allnums==0){
                    location.reload();
                }else{
                    $('form[data-role="moderationTools"]').submit();
                }
            }
            if(inpage==outpage&&inpage<=endpage){
                $('#lockingpage')[0].value=inpage;
                searchgrave(inpage);
                outpage++;
            }
        },200);
    }
})();