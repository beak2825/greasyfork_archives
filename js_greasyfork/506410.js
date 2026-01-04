// ==UserScript==
// @name         链接公糖判断
// @namespace    https://sstm.moe/
// @version      0.3
// @description  判断三阶勋章申请贴里的黄糖链接状态
// @author       367ddd（叫我牛顿吧）
// @license MIT
// @match        https://sstm.moe/topic/279145-*
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506410/%E9%93%BE%E6%8E%A5%E5%85%AC%E7%B3%96%E5%88%A4%E6%96%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/506410/%E9%93%BE%E6%8E%A5%E5%85%AC%E7%B3%96%E5%88%A4%E6%96%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const nowtime=new Date();
    var linkid=0;
    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return false;
    }
    function setCookie(cname,cvalue)
    {
        //console.log('cookies:'+cname+':'+cvalue);
        document.cookie = cname + "=" + cvalue + "; path=/topic/279145-%E4%B8%89%E9%98%B6%E5%8B%8B%E7%AB%A0%EF%BC%88%E6%B0%B8%E4%B9%85%E5%8B%8B%E7%AB%A0%EF%BC%89%E5%85%91%E6%8D%A2%E7%94%B3%E8%AF%B7%E3%80%90%E7%A6%81%E6%B0%B4%E3%80%91%E3%80%90%E5%8D%8A%E8%87%AA%E5%8A%A8%E3%80%91/; domain=sstm.moe";
    }
    function deldot(str){
        const regex = /,/g;
        return str.replace(regex, '');
    }
    function autosubmit(link,object,time,checked){
        var xhr = new XMLHttpRequest();
        var doc = null;
        xhr.open('GET', link, true);
        let topicid=0;
        topicid=parseInt(link.match(/\d+/g)[0]);
        if(topicid==257048||topicid==279145||topicid==266313||!(link.includes('topic')||link.includes('files'))){return(false);}
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                var response = this.response;
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                if(doc==null){console.error();}
                let dataid=0;
                let jiecao=0;
                let maxjiecao=0;
                let output='';
                let used='默认';
                if(link.indexOf('/files/file/')>0){
                    return($(doc).find('[title="获得此下载支持"]').length>0?autosubmit($(doc).find('[title="获得此下载支持"]')[0].href,object,time,checked):false);
                }
                if(link.indexOf('do=findComment')>0){
                    dataid=link.match(/\d+/g).pop();
                }else{
                    if($(doc).find('[data-controller="core.front.core.comment"]').length<=0){console.log(link);}
                    dataid=$(doc).find('[data-controller="core.front.core.comment"]')[0].getAttribute('data-commentid');
                }
                let temptime=new Date($(doc).find('[data-commentid="'+dataid+'"]').find('time').attr('datetime'));
                let deltadays=Math.floor((time-temptime)/(1000*3600*24));
                $(doc).find('[data-commentid="'+dataid+'"]').find('tr.ratePublicFund').each(function(){
                    if(this.children[1].innerText.includes('节操')){
                        output+=(deldot(this.children[1].innerText)+'--》'+this.children[2].innerText+'<br>\n');
                        maxjiecao=parseInt(deldot(this.children[1].innerText))>maxjiecao?parseInt(deldot(this.children[1].innerText)):maxjiecao;
                        jiecao+=parseInt(deldot(this.children[1].innerText));
                    }
                });
                if(checked){
                    used='已评分';
                    if(!(getCookie('usedcommentid').includes(dataid))){
                        console.log(dataid+'added');
                        setCookie('usedcommentid',getCookie('usedcommentid')+dataid+'|');
                    }
                }else{
                    if(getCookie('usedcommentid').includes(dataid)){
                        used='未评分已使用';
                    }else{
                        used='未使用';
                    }
                }
                if(jiecao>30&&maxjiecao>30&&deltadays<=180&&used!='未评分已使用'){
                    $('<div style="    background: green;    color: gold;    font-size: large;">距申请日'+deltadays+'天; '+jiecao+'节操; 使用情况：'+used+'<br>'+output.trim()+'</div>').insertAfter($('#'+object)[0]);
                    return(true);
                }else{
                    $('<div style="    background: red;    color: gold;    font-size: large;">距申请日'+deltadays+'天; '+jiecao+'节操; 使用情况：'+used+'<br>'+output.trim()+'</div>').insertAfter($('#'+object)[0]);
                    return(false);
                }
            } else {
                console.error(this.statusText);
            }
        };
        xhr.send();
    }
    if(getCookie('usedcommentid')===false){setCookie('usedcommentid','helloworld|')}
    $('article').each(function(){
        let temptime=new Date($(this).find('time').attr('datetime'));
        let funded=false;
        $(this).find('tr.ratePublicFund').each(function(){
            if(this.children[1].innerText.includes('羽毛')){
                funded=true;
            }
        });
        $(this).find('[data-role="commentContent"]').find('a').each(function(){
            linkid++;
            this.id='judgement'+linkid;
            autosubmit(this.href,this.id,temptime,funded);
        })
    })
    // Your code here...
})();