// ==UserScript==
// @name         LAW
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  LC AUTO WATCH
// @author       XB
// @match        https://edu.inspur.com/*
// @match        https://office.inspur.com/*
// @icon         https://edu.inspur.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450439/LAW.user.js
// @updateURL https://update.greasyfork.org/scripts/450439/LAW.meta.js
// ==/UserScript==
let curTime = "";

function setCookie(cname,cvalue,exdays=1)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + encodeURI(cvalue) + "; " + expires +";path=/";
}
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++)
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return decodeURI(c.substring(name.length,c.length));
  }
  return "";
}
function clear(){
    setCookie('urllist',JSON.stringify([]),1);
}
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            let ret = JSON.parse(str);
            return ret;
        } catch(e) {
            console.log(e);
            return [];
        }
    }
    console.log('It is not a string!')
}
function back(){
    //let urllist = [];
    //const urlstr = getCookie('urllist');
    /*if(urlstr!==''){
        urllist=JSON.parse(urlstr);
    }*/
    let urllist=isJSON(getCookie('urllist'));
    if(urllist.length>0){
        let url=urllist.pop();
        setCookie('urllist',JSON.stringify(urllist),1);
        window.location.href=url;
    }else{
        window.history.back(-1);
    }
}
function go(url){
    let urllist=isJSON(getCookie('urllist'));
    urllist.push(window.location.href);
    setCookie('urllist',JSON.stringify(urllist),1);
    window.location.href=url;
}
function refreshSchedule(){
    const divStartArea=document.getElementById('divStartArea');
    const dvHeartTip=document.getElementById('dvHeartTip');
    if(dvHeartTip!==null){
        commonHelper.learnKng();
    }
    if(divStartArea!==null){
        const spanLeavTimes=document.getElementById('spanLeavTimes').innerText;
        if(divStartArea.style.display==="none"){
            back();
        }else{
            try{
                if(curTime===""||curTime===spanLeavTimes){
                    myPlayer.play();
                }else{
                    console.log(divStartArea.innerText);
                }
                myPlayer.setVolume(0);
                myPlayer.setPlaybackRate(2)
                curTime=spanLeavTimes;
            }catch(e){
                return;
            }
        }
    }
}
(function() {
    'use strict';

    const body = document.getElementsByTagName("body")[0];
    body.style.webkitFilter="none";
    body.style.mozFilter="none";
    body.style.msFilter="none";
    body.style.oFilter="none";
    body.style.filter="none";
    body.style.Filter="none";
    const html = document.getElementsByTagName("html")[0];
    html.style.webkitFilter="none";
    html.style.mozFilter="none";
    html.style.msFilter="none";
    html.style.oFilter="none";
    html.style.filter="none";
    html.style.Filter="none";

    let i=1;
    while(1){
        let contentitem=document.getElementById('contentitem'+i);
        if(contentitem!==null){
            let url=$('#contentitem'+i).attr('onclick').match(/learningKnowledge\(\"(.*).html"/)[1]+".html",flag=false;
            console.log(url);
            let skipstr=getCookie('skip'),skip=[];
            if(skipstr!==''){
                skip=JSON.parse(skipstr);
            }
            for(let s of skip){
                if(s===url){
                    flag=true;
                    break;
                }
            }
            if(flag){
                i++;
                continue;
            }
            const progress=contentitem.getElementsByClassName('el-plan-progress-text')[0].innerText;
            if(progress==="100%"){
                i++;
                continue;
            }
            setCookie('tmp',url,1);
            go(url);
            break;
        }else{
            break;
        }
        i++;
    }

    const StyBaseExectorInfo_divLabelHtmlContents=document.getElementById('StyBaseExectorInfo_divLabelHtmlContents');
    if(StyBaseExectorInfo_divLabelHtmlContents!==null){
        let trs = StyBaseExectorInfo_divLabelHtmlContents.getElementsByClassName('hand');
        console.log(trs);
        for(i =0;i<trs.length;i++){
            if(trs[i].nodeName==='TR'){
                //console.log(trs[i]);
                let str=trs[i].lastElementChild.lastElementChild.lastElementChild.innerText;
                if(str==="100%"||str==="查看"){
                    continue;
                }
                if(str==="开始考试"){
                    let skipstr=getCookie('skip'),tmp=getCookie('tmp'),skip=[];
                    if(tmp!==''){
                        if(skipstr!==''){
                            skip=JSON.parse(skipstr);
                        }
                        skip.push(tmp);
                        setCookie('skip',JSON.stringify(skip),1);
                    }
                    back();
                    break;
                }
                //window.location.href=window.location.href;
                let url=trs[i].getAttribute('onclick');
                console.log(url);
                go(url.match(/return StudyRowClick\(\'(.*).html?/)[1]+".html");
                break;
                //window.history.pushState(null,"",url.match(/return StudyRowClick\(\'(.*).html?/)[1]+".html");
            }
        }
        if(i>0&&i==trs.length){
            back();
        }
    }

    const tableContainer=document.getElementById('tableContainer');
    if(tableContainer!==null){
        let trs = tableContainer.firstElementChild.firstElementChild.children;
        console.log(trs);
        if(trs.length>1&&trs[1].nodeName==='TR'&&trs[1].className!=="empty"){
            //console.log(trs[1]);
            //window.location.href=window.location.href;
            let check=trs[1].firstElementChild.firstElementChild.firstElementChild;
            if(check!==null){
                check.checked=true;
                ClickSelf(check);
                $('#hidDeleteType').val("BacthDelete");
                document.getElementById('btnDelete').click();
            }
            let url=trs[1].children[2].innerHTML;
            console.log(url);
            go(url.match(/isOpenFaceId\(&quot;&quot;,&quot;&quot;,&quot;(.*).html?/)[1]+".html");
            //window.location.replace(url.match(/isOpenFaceId\(&quot;&quot;,&quot;&quot;,&quot;(.*).html?/)[1]+".html");
        }
    }

    const normalrow=document.getElementsByClassName('normalrow clearfix');
    if(normalrow!==null){
        let i=0;
        for(;i<normalrow.length;i++){
            if(normalrow[i].nodeName==='DIV'){
                let str=normalrow[i].getElementsByClassName('fontnumber study-schedule')[0].innerHTML;
                if(str.match(/100/)!==null){
                    continue;
                }
                //window.location.href=window.location.href;
                let url=normalrow[i].getElementsByClassName('text-color6')[0].getAttribute('href');
                console.log(url);
                go(url.match(/javascript:void\(StudyRowClick\(\'(.*).html?/)[1]+".html");
                break;
            }
        }
        if(i>0&&i==normalrow.length){
            back();
        }
    }
    let timer=null;
    clearInterval(timer);
    timer=setInterval(() => {
        refreshSchedule();
    }, 10000);
    if(typeof phaseTrackIntervalTime!=='undefined'){
        phaseTrackIntervalTime = 60000;
    }
    // Your code here...
})();