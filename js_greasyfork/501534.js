// ==UserScript==
// @name         bilibili-video remain time on tab title
// @namespace    smallsupo
// @version      1.0
// @description  show bilibili video remaining time on tab title
// @description:zh-CN 在分页标题中 显示bilibili影片剩馀时间
// @description:zh-TW 在分頁標題中 顯示bilibili影片剩餘時間
// @author       smallsupo (smallsupo@gmail.com)
// @match        *://www.bilibili.com/video/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bilibili.com&size=32
// @grant        none
// @license      Copyright smallsupo
// @downloadURL https://update.greasyfork.org/scripts/501534/bilibili-video%20remain%20time%20on%20tab%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/501534/bilibili-video%20remain%20time%20on%20tab%20title.meta.js
// ==/UserScript==

//--------------------------------------------
let showWhenFullScreenVideo=true;let fontsize="36px";
class STD{ //smallsupo tools - dom ui
    static DISPLAY_NONE=0;static VISIBILITY_HIDDEN=1;
    constructor(){}
    static createEL(htmltag,id,style){
        let e=document.createElement(htmltag);if(id!=null)e.setAttribute("id",id);if(style!=null)e.setAttribute("style",style);
        return e;
    }
    static eventStopBubbling(e) {
        e = window.event || e;if (e.stopPropagation) {e.stopPropagation();} else {e.cancelBubble = true;}
    }
    static getDomNode(root,queryArray){
        let node=root;
        if(queryArray.length>0){
            node=root.querySelector(queryArray[0]);
            for(let i=1;i<queryArray.length;i++){if(node!=null){node=node.querySelector(queryArray[i]);}}
        }
        return node;
    }
    static getDomNodes(root,queryArray){
        let nodes=null;
        let endquery=queryArray.pop();
        let node=STD.getDomNode(root,queryArray);
        if(node!=null){nodes=node.querySelectorAll(endquery);}
        return nodes;
    }
    static getDomAttribute(root,queryArray,attribute){
        let value=null;let node=this.getDomNode(root,queryArray);
        if(node!=null){if(node.hasAttribute(attribute))value=node.getAttribute(attribute);}
        return value;
    }
    static getDomInnerText(root,queryArray){
        let value=null;let node=this.getDomNode(root,queryArray);
        if(node!=null){value=node.innerText;}
        return value;
    }
}
let titleTime;
let title;
let totaltime;let currenttime;
let observer=null;
let timeInterval=null;let timeIntervalRunning=false;
let delaytimer=null;
let currentTime;
let remaintime;
let currenturl;
let reget=false;
let urlchanging=false;
const debug=false;
function setTitle(time){
    document.title=time+" "+title;
}
function getVideoTotalTime(){
    return STD.getDomInnerText(document.getElementsByTagName('body')[0],['span[class="bpx-player-ctrl-time-duration"]']);
}
function getVideoCurrentTime(){
    return STD.getDomInnerText(document.getElementsByTagName('body')[0],['span[class="bpx-player-ctrl-time-current"]']);
}
function isPlay(){
    let result=false;
    let n=STD.getDomNode(document.getElementsByTagName('body')[0],['div[class~="bpx-state-paused"]']);
    if(n==null)result=true;
    return result;
}
function isHide(){
    let result=false;
    let n=STD.getDomNode(document.getElementsByTagName('body')[0],['div[class~="bpx-state-no-cursor"]']);
    if(n!=null) result=true;
    return result;
}
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function runRemainTimer(){
    if(debug)console.log("play：",isPlay(),"hide：",isHide());
    if(isPlay()&&timeIntervalRunning==false){
        //clearTimeout(delaytimer);
        delaytimer=setTimeout(startTimeInterval,1000);
    }else if(!isPlay()){
        reget=true;
        setTimeout(stopTimeInterval,1000);
    }
}
function computeRemainTime(){
    currenttime=getVideoCurrentTime();
    if(debug)console.log("1 ",currenttime);
    currenttime=toTimeType(currenttime);
    if(debug)console.log("2 ",currenttime);
    totaltime=getVideoTotalTime(); totaltime=toTimeType(totaltime);
    remaintime=totaltime-currenttime;
    if(debug)console.log("3 ",remaintime);
    return parseInt(remaintime);
}
function formatTimeAddZero(s){
    let count = (s.match(/:/g) || []).length;
    if(count==0)return "0:0:"+s;
    if(count==1)return "0:"+s;
    return s;
}
function formatRemainTime(time){
    let result="";let totalSeconds=time;
    let h = Math.floor(totalSeconds / (3600*1000));
    totalSeconds %= (3600*1000);
    let m = Math.floor(totalSeconds / (60*1000));
    let s = Math.round((totalSeconds % (60*1000)) /1000);
    if(debug)console.log("4-1 ",h+" "+m+" "+s);
    if(h!=0)result+=h+":";
    if(m!=0){
        if(h!=0){
            if(m<10)result+="0"+m+":";else result+=m+":";
        }else{
            result+=m+":";
        }
    }else if(m==0){
        if(h!=0){result+="00:";}
    }
    if(s!=0){
        if(s<10)result+="0"+s;else result+=s;
    }else {result+="00";}
    if(h==0&&m==0)result="0:"+result;
    if(debug)console.log("4-2 ",result);
    return result;
}
function toTimeType(s){
    const datefake="2024-01-01 ";
    let time=formatTimeAddZero(s)
    let d=new Date(datefake+time);
    let d1=new Date(datefake);
    return parseInt(d.getTime()-d1.getTime());
}
function isFullScreenVideo(){
let result=false;
    let n=STD.getDomNode(document.getElementsByTagName('body')[0],['div[class~="bpx-player-container"]']);
    if(n!=null) {
        if(n.getAttribute("data-screen")=="full")result=true;
    }
    return result;
}
function isFullWebVideo(){
let result=false;
    let n=STD.getDomNode(document.getElementsByTagName('body')[0],['div[class~="bpx-player-container"]']);
    if(n!=null) {
        if(n.getAttribute("data-screen")=="web")result=true;
    }
    return result;
}
function setRemainHTMLTagOnFullVideo(text,show){

   let id="smallsupo_remaintime_fullvideo";
   let n=document.getElementById(id);
   if(n==null){
       let node=document.querySelector('div[class^="bpx-player-video-area"]');
       node=node.parentElement;
       let x=document.createElement("div");x.setAttribute("id",id);
       x.setAttribute("style","position:absolute;z-index:999999;background-color:black;padding:4px;color:white;font-size:"+fontsize+";");
       node.appendChild(x);
   }else{
       if(show){
           n.style.display="block";
           n.innerText=text;
       }else{
           n.style.display="none";
       }
   }
}
function showRemainTimeInTitle(){
    if(urlchanging)return;
    if(!isPlay()){
        reget=true;
        setTimeout(stopTimeInterval,1000);
    }
    if(debug)console.log("showRemainTimeInTitle ",isLive());
    if(isLive()){ // living video
        /*
        if(isHide()){
            if(remaintime===undefined){remaintime=getVideoCurrentTime();remaintime=toTimeType(remaintime);reget=false;}
            remaintime+=1000*getPlayRate();
            setTitle(formatRemainTime(remaintime));
        }else{ //show
            remaintime=getVideoCurrentTime();
            console.log(remaintime);
            remaintime=toTimeType(remaintime);
            setTitle(formatRemainTime(remaintime));
        }
        */
    }else{ //general video
        remaintime=computeRemainTime();
        if(remaintime<=0){setTitle("");setRemainHTMLTag("");return;}
        let r=formatRemainTime(remaintime/getPlayRate());
        setTitle(r);
        if(getPlayRate()==1){
            setRemainHTMLTag(" (−"+r+")");
            if(showWhenFullScreenVideo)setRemainHTMLTagOnFullVideo(r,isFullScreenVideo()||isFullWebVideo());
        }else{
            setRemainHTMLTag(" (−"+r+" "+getPlayRate()+"x speed)");
            if(showWhenFullScreenVideo)setRemainHTMLTagOnFullVideo(r+" ("+getPlayRate()+"x speed)",isFullScreenVideo()||isFullWebVideo());
        }
    }//end general video
    //console.log(": ",currenttime," ",totaltime);
}
function isLive(){
    let result=false;
    /*
    let node=STD.getDomNode(document.getElementsByTagName('body')[0],['span[class="ytp-time-duration"]']);
    node=node.parentElement.parentElement;
    let text=node.getAttribute("class");
    if(text.indexOf("ytp-live")!=-1){
        result=true;
    }*/
    return result;
}
function getPlayRate(){
    let rate=1;
    if(document.querySelector("video")!=null){rate=document.querySelector("video").playbackRate;}
    return rate;
}
function stopTimeInterval(){
    if(timeInterval!=null){
        if(debug)console.log("stopTimeInterval");
        timeIntervalRunning=false;
        clearInterval(timeInterval);timeInterval=null;
    }
}
function startTimeInterval(){
    if(timeInterval==null){
        if(debug)console.log("startTimeInterval");
        timeIntervalRunning=true;
        timeInterval=setInterval(showRemainTimeInTitle,1000);
    }
}
function setRemainHTMLTag(text){
   let id="smallsupo_remaintime";
   let n=document.getElementById(id);
   if(n==null){
       let node=STD.getDomNode(document.getElementsByTagName('body')[0],['div[class="bpx-player-ctrl-time-label"]']);
       if(node!=null){
           let x=STD.createEL("span",id,null);
           node.appendChild(x);
       }
   }else{
       n.innerText=text;
   }
}
function init(){
    urlchanging=false;
    if(debug)console.log("init");
    if(/www.bilibili.com\/video\//.test(window.location.href)){
        title=document.title;
        totaltime=getVideoTotalTime();
        console.log(title+":"+totaltime);
        if(totaltime!=null)totaltime=toTimeType(totaltime);
        remaintime=undefined;
        setRemainHTMLTag("");
        startObserver();
    }
}
async function uninit(){
    if(debug)console.log("uninit");
    stopObserver();
    await delay(1000);
    stopTimeInterval();
}
function stopObserver(){
    if(observer!=null){
    if(debug)console.log("stopObserver");
      observer.disconnect();observer=null;
    }
}
function startObserver(){
    if(debug)console.log("startObserver");
    observer=new MutationObserver(runRemainTimer);
    let node=STD.getDomNode(document.getElementsByTagName('body')[0],['span[class="bpx-player-ctrl-time-current"]']);
    if(node==null){node=document.getElementsByTagName('body')[0];}
    observer.observe(node,{attributes:true,childList:true,subtree:true});
}
function start_page_interval(){
    let timer;
    //console.log("start_page_interval");
   setInterval(()=>{
        if (window.location.href !== currenturl) {
            urlchanging=true;
            currenturl=window.location.href;
            //console.log("url changed");
            uninit();
            clearTimeout(timer);
            timer=setTimeout(function() {
                init();
            }, 3000);
        }
    }, 1000);
}
setTimeout(function() {
(function() {
    console.log("BiliBili-video remain time on tab title...啟動")
     start_page_interval();
})();
}, 3000);