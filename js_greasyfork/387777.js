// ==UserScript==
// @name         关于完全听不懂S1巨魔在说什么的事
// @namespace    http://bbs.saraba1st.com
// @version      0.01
// @description  只要被骂三次“巨魔”就会变成乱码
// @author       RobinEatCorn
// @match        https://*.saraba1st.com/2b/thread-*
// @match        https://*.saraba1st.com/2b/forum.php?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/387777/%E5%85%B3%E4%BA%8E%E5%AE%8C%E5%85%A8%E5%90%AC%E4%B8%8D%E6%87%82S1%E5%B7%A8%E9%AD%94%E5%9C%A8%E8%AF%B4%E4%BB%80%E4%B9%88%E7%9A%84%E4%BA%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387777/%E5%85%B3%E4%BA%8E%E5%AE%8C%E5%85%A8%E5%90%AC%E4%B8%8D%E6%87%82S1%E5%B7%A8%E9%AD%94%E5%9C%A8%E8%AF%B4%E4%BB%80%E4%B9%88%E7%9A%84%E4%BA%8B.meta.js
// ==/UserScript==

var scanRex=/巨魔|傻逼|滚|去死|你妈死了|(N|n)(M|m)(S|s|\$)(L|l)/;
const MAX_NAME_INDEX_LENGTH=30;

var parser=new DOMParser();
var idx={};
var threadData;
var userId;


function saveThreadData(){
    var threadId=threadData.currentThread;
    if(isUndefined(threadId)||isNaN(threadId)){ throw Error("invalid thread ID");}
    var nameIndex=GM_getValue("stage1st-thread",[]);
    if(!nameIndex.includes(threadId)){
        if(nameIndex.length>=MAX_NAME_INDEX_LENGTH){
            var tmpid=nameIndex.shift();
            GM_deleteValue(`stage1st-thread-${tmpid}`);
            GM_deleteValue(`stage1st-thread-${tmpid}-idx`);
        }
        nameIndex.push(threadId);
        GM_setValue("stage1st-thread",nameIndex)
    }
    GM_setValue(`stage1st-thread-${threadId}`,threadData);
    saveIdx();
}

function saveIdx(){
    var idxAb={};
    Object.keys(idx).forEach((key)=>{
        var abstract={};
        abstract.pid=idx[key].pid;
        abstract.xw1=idx[key].xw1;
        abstract.floor=idx[key].floor;
        if(idx[key].quotePid){ abstract.quotePid=idx[key].quotePid; }
        abstract.textInside=idx[key].textInside;
        idxAb[key]=abstract;
    });
    GM_setValue(`stage1st-thread-${threadData.currentThread}-idx`,idxAb);
}

function arrayAdd(value){ this.push(value);this.sort(); }
function preProcess(dom){
    var plhins=dom.getElementsByClassName("plhin");
    for(let i=0;i<plhins.length;i++){
        plhins[i].pid=Number(plhins[i].id.substr(3));
        plhins[i].xw1=Number(plhins[i].getElementsByClassName("xw1")[0].href.split("space-uid-")[1].split(".")[0]);
        let tmpele=plhins[i].querySelector("a[id^=postnum]>em");
        if(tmpele){
            plhins[i].floor=Number(tmpele.innerText);
        } else {
            plhins[i].floor=1;
        }
        var quote=plhins[i].querySelector("div.quote>blockquote>font>a");
        if(quote){
            plhins[i].quoteURL=new URL(quote.href);
            plhins[i].quotePid=Number(plhins[i].quoteURL.searchParams.get("pid"));
        }
        var textInside="";
        let tmpt_f=plhins[i].querySelector(".t_f");
        if(tmpt_f){
            var childNodes=tmpt_f.childNodes;
            for(let i=0;i<childNodes.length;i++){
                if(childNodes[i].nodeType==Node.TEXT_NODE){ textInside+=childNodes[i].textContent; }
            }
            plhins[i].textInside=textInside;
        } else {
            plhins[i].textInside="";
        }
        idx[`pid${plhins[i].pid}`]=plhins[i];
        idx[`floor${plhins[i].floor}`]=plhins[i];
        threadData.maxFloor=Math.max(threadData.maxFloor,plhins[i].floor);
        if(isUndefined(threadData.userTrollIndex[plhins[i].xw1])){ threadData.userTrollIndex[plhins[i].xw1]=0; }
    }
    let tmpEle=dom.querySelector(`span[title^="共"]`);
    if(tmpEle){
        let tmps=tmpEle.innerText;
        threadData.maxPage=Number(tmps.substring(3,tmps.length-2));
    } else {
        threadData.maxPage=1;
    }
    return {idx,threadData};
}

function shiftString(s,shift=1){
    var ans="";
    for(let i=0;i<s.length;i++){
        ans+=String.fromCharCode(s.charCodeAt(i)+shift);
    }
    return ans;
}

function trollize(dom,shift=1){
    shift=Number(shift);
    if(isUndefined(dom.nodeType)){ return;}
    if(Number(dom.trollShift)==Number(shift)){ return; }
    if(isUndefined(dom.trollShift)||isNaN(dom.trollShift)){ dom.trollShift=0; }
    var nodeIterator=document.createNodeIterator(dom,NodeFilter.SHOW_TEXT);
    var currentNode;
    while(currentNode=nodeIterator.nextNode()){
        currentNode.textContent=shiftString(currentNode.textContent,shift-dom.trollShift);
    }
    dom.trollShift=shift;
}

function appendEnterPoint(dom,shift){
    var enterPoint=document.createElement("div");
    enterPoint.classList.add("enterPoint");
    enterPoint.innerText="进入该巨魔视角";
    enterPoint.shiftView=shift;
    enterPoint.entered=false;
    enterPoint.onclick=function(){
        if(this.entered){
            trollize(document,0);
            this.entered=false;
            this.innerText="进入该巨魔视角";
        } else {
            let rep=confirm("确定要进入该巨魔视角？");
            if(rep==false){ return; }
            trollize(document,shift)
            this.entered=true;
            this.innerText="离开该巨魔视角";
        }
    }
    dom.appendChild(enterPoint);
}

function recognizeTrolls(){
    var {maxFloor}=threadData;
    for(let i=1;i<=maxFloor;i++){
        if(threadData.seenFloors.includes(i)) { continue; }
        let currentFloor=idx[`floor${i}`];
        if(isUndefined(currentFloor)){ continue; }
        if(!isUndefined(currentFloor.quotePid)  && idx[`pid${currentFloor.quotePid}`]){
            if(currentFloor.textInside.match(scanRex)){
                threadData.userTrollIndex[idx[`pid${currentFloor.quotePid}`].xw1]+=4;
                threadData.userTrollIndex[currentFloor.xw1]+=2;
            }
        } else {
            if(currentFloor.textInside.match(scanRex)){
                threadData.userTrollIndex[currentFloor.xw1]+=1;
                if(currentFloor.textInside.match("楼主|lz|Lz|lZ|LZ") && !isUndefined(idx.floor1)){
                    threadData.userTrollIndex[idx.floor1.xw1]+=4;
                    threadData.userTrollIndex[currentFloor.xw1]+=1;
                }
            }
        }
        threadData.seenFloors.add(i);
    }
    for(let i=1;i<=maxFloor;i++){
        let currentFloor=idx[`floor${i}`];
        if(isUndefined(currentFloor)||isUndefined(currentFloor.nodeType)){ continue; }
        if(threadData.userTrollIndex[currentFloor.xw1]>=12){
            let trollShift=Math.trunc(threadData.userTrollIndex[currentFloor.xw1]/12);
            trollize(currentFloor,trollShift);
            var enterPoint=currentFloor.querySelector(".enterPoint");
            if(enterPoint){
                enterPoint.shift=trollShift;
            } else {
                var currentt_f=currentFloor.querySelector(".t_f");
                if(currentt_f){ appendEnterPoint(currentFloor.querySelector(".t_f"),-trollShift); }
            }
        }
        if(!isUndefined(currentFloor.quotePid) && idx[`pid${currentFloor.quotePid}`]){
            if(threadData.userTrollIndex[idx[`pid${currentFloor.quotePid}`].xw1]>=12){
                trollize(currentFloor.querySelector("div.quote"));
            }
        }
    }
    if(threadData.userTrollIndex[userId]>=12){ trollize(document,-Math.trunc(threadData.userTrollIndex[userId]/12))}
    //console.log(threadData);
    saveThreadData();
}

function grabPages(){
    //console.log(idx);
    //console.log(threadData);
    var pageToGrab=1;
    var flag=false;
    while(threadData.seenPages.includes(pageToGrab)&&pageToGrab<=threadData.maxPage){pageToGrab++;}
    if(pageToGrab==threadData.maxPage+1&&threadData.currentPage==threadData.maxPage){recognizeTrolls();console.log(threadData);return;}
    if(pageToGrab==threadData.maxPage+1) { pageToGrab--; flag=1; }
    console.log(`grab page ${pageToGrab}(关于完全听不懂S1巨魔在说什么的事)`);
    var xhr=new XMLHttpRequest();
    if(flag){
        xhr.onreadystatechange=function(){
            if(this.readyState==4&&this.status==200){
                var dom=parser.parseFromString(this.response,"text/html");
                preProcess(dom);
                recognizeTrolls();
                //console.log(dom);
                threadData.seenPages.add(pageToGrab);
                saveThreadData();
                recognizeTrolls();
                console.log(threadData);
            }
        }
    } else {
        xhr.onreadystatechange=function(){
            if(this.readyState==4&&this.status==200){
                var dom=parser.parseFromString(this.response,"text/html");
                preProcess(dom);
                recognizeTrolls();
                //console.log(dom);
                threadData.seenPages.add(pageToGrab);
                saveThreadData();
                setTimeout(grabPages,1000);
            }
        }
    }
    xhr.open("GET",`https://bbs.saraba1st.com/2b/thread-${threadData.currentThread}-${pageToGrab}-1.html`);
    xhr.send();
}

function addCSS(){
    var styleEle=document.createElement("style");
    document.head.appendChild(styleEle);
    var styleSheet=styleEle.sheet;
    styleSheet.insertRule(`
        .enterPoint {
                text-decoration : none;
                background-color : #eeeeee;
                color : #000000;
                user-select : none;
                padding-left : 1%;
                padding-right : 1%;
                font-weight : bold;
                text-align : center;
        }`);
    styleSheet.insertRule(`
        .enterPoint:hover {
                background-color : #888888;
        }`);
    styleSheet.insertRule(`
        .enterPoint:active {
                background-color : #000000;
                color : #FFFFFF;
        }`);
}

function processWindow(){
    //if(location.href.indexOf("2b/thread")==-1){ return -1; }
    let nameIndex=GM_getValue("stage1st-thread",[]);
    console.log(`关魔说事：本地存储了 ${nameIndex.length} 篇帖子（最多 ${MAX_NAME_INDEX_LENGTH} 篇）`);
    let tmpele=document.querySelector("#um .avt.y a");
    if(tmpele){
        userId=Number(tmpele.href.split("space-uid-")[1].split(".html")[0]);
        if(isNaN(userId)||isUndefined(userId)){ userId=0; }
    } else { userId=0;}
    let href=new URL(location.href);
    var pageId;
    var threadId;
    if(href.searchParams.get("mod")=="viewthread"){
        threadId=href.searchParams.get("tid");
        pageId=Number(href.searchParams.get("page")) || 1;
    } else {
        threadId=location.href.split("-");
        pageId=Number(threadId[2]);
        threadId=Number(threadId[1]);
    }
    if(isUndefined(pageId)||isUndefined(threadId)||isNaN(pageId)||isNaN(threadId)){ return -1;}
    console.log(`thread=${threadId},page=${pageId},(关于完全听不懂S1巨魔在说什么的事)`);
    threadData=GM_getValue(`stage1st-thread-${threadId}`,undefined);
    if(!threadData){
        threadData={
            startFloor:1,
            maxFloor:0,
            maxPage:0,
            currentPage:pageId,
            currentThread:threadId,
            userTrollIndex:{0:0},
            seenPages:[],
            seenFloors:[]
        };
    } else {
        threadData.currentPage=pageId;
        threadData.currentThread=threadId;
    }
    threadData.userTrollIndex[userId]=0;
    idx=GM_getValue(`stage1st-thread-${threadId}-idx`,{});
    threadData.seenPages.add=arrayAdd;
    threadData.seenFloors.add=arrayAdd;
    threadData.seenPages.add(pageId);
    preProcess(document);
    addCSS();
    saveThreadData();
    //console.log(idx);
    //console.log(threadData);
    setTimeout(grabPages,1000);
}

(function() {
    'use strict';

    window.onload=processWindow;
})();