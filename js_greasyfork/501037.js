// ==UserScript==
// @name         Youtube-video remaining time on tab title
// @namespace    smallsupo
// @version      2.0
// @description  show youtube video remaining time on tab title
// @description:zh-TW 在分頁標題中 顯示youtube影片剩餘時間
// @author       smallsupo (smallsupo@gmail.com)
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @noframes
// @license      Copyright smallsupo
// @downloadURL https://update.greasyfork.org/scripts/501037/Youtube-video%20remaining%20time%20on%20tab%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/501037/Youtube-video%20remaining%20time%20on%20tab%20title.meta.js
// ==/UserScript==

//----chage false if you don't what see it --------------
let showTimeOnTabTitle=true;
let showTimeWhenFullScreenVideo=true;let fontsize="36px";
//--------------------------------------------
class SmallTools{
    constructor(){}
    attribute(root,querystring,attribute){
        let result=null;let n=root;if(n==null)n=document;
        n=n.querySelector(querystring);
        if(n!=null)result=n.getAttribute(attribute);
        return result;
    }
innerText(root,querystring){
    let result=null;let n=root;if(n==null)n=document;
    n=n.querySelector(querystring);if(n!=null)result=n.innerText;return result;
}
    create(htmltag,id,style){
        let node=document.createElement(htmltag);if(id!=null)node.setAttribute("id",id);if(style!=null)node.setAttribute("style",style);
        return node;
    }
}
let q=new SmallTools();
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
function setTitle(time){
    document.title=time+" "+title;
}
function getVideoTotalTime(){
    return q.innerText(document,'span.ytp-time-duration');
}
function getVideoCurrentTime(){
    return q.innerText(document,'span.ytp-time-current');
}
function isPlay(){
    let result=false;
    let n=q.attribute(document,'div#movie_player',"class");
    if(n!=null)if(n.indexOf("playing-mode")!=-1)result=true;
    return result;
}
function isHide(){
    let result=false;
    let n=q.attribute(document,'div#movie_player',"class");
    if(n!=null)if(n.indexOf("ytp-autohide")!=-1)result=true;
    return result;
}
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function runRemainTimer(){
    //console.log("play：",isPlay(),"hide：",isHide());
    if(isPlay()&&timeIntervalRunning==false){
        //clearTimeout(delaytimer);
        delaytimer=setTimeout(startTimeInterval,1000);
    }else if(!isPlay()){
        reget=true;
        setTimeout(stopTimeInterval,1000);
    }
}
function computeRemainTime(){
    currenttime=getVideoCurrentTime();if(debug)console.log("1 ",currenttime);
    currenttime=HmsToMiliseconds(currenttime);if(debug)console.log("2 ",currenttime);
    totaltime=getVideoTotalTime(); totaltime=HmsToMiliseconds(totaltime);
    remaintime=totaltime-currenttime;if(debug)console.log("3 ",remaintime);
    return parseInt(remaintime);
}
function formatTimeAddZero(s){
    let count = (s.match(/:/g) || []).length;
    if(count==0)return "0:0:"+s;
    if(count==1)return "0:"+s;
    return s;
}
function milisecondsToHms(time){
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
function HmsToMiliseconds(s){
    const datefake="2024-01-01 ";
    let time=formatTimeAddZero(s)
    //console.log("time ",time);
    let d=new Date(datefake+time);
    let d1=new Date(datefake);
    return parseInt(d.getTime()-d1.getTime());
}
function showtabandfullvideo(text){
            if(showTimeOnTabTitle)setTitle(text);
            if(showTimeWhenFullScreenVideo)setRemainHTMLTagOnFullVideo(text,isFullScreenVideo()||isFullWebVideo());
}
function showRemainTimeInTitle(){
    if(urlchanging)return;
    if(isLive()){ // living video
        if(isHide()){
            if(remaintime===undefined){remaintime=getVideoCurrentTime();remaintime=HmsToMiliseconds(remaintime);reget=false;}
            remaintime+=1000*getPlayRate();
            showtabandfullvideo(milisecondsToHms(remaintime));
        }else{ //show
            remaintime=getVideoCurrentTime();
            //console.log(remaintime);
            remaintime=HmsToMiliseconds(remaintime);
            showtabandfullvideo(milisecondsToHms(remaintime));
        }
    }else{ //general video
        if(isHide()){
            if(remaintime===undefined){
                remaintime=computeRemainTime();
                reget=false;
            }
            remaintime-=1000*getPlayRate();
            if(remaintime<=0){if(showTimeOnTabTitle)setTitle("");return;}
            showtabandfullvideo(milisecondsToHms(remaintime/getPlayRate()));
        }else{ //show
            remaintime=computeRemainTime();
            if(remaintime<=0){if(showTimeOnTabTitle)setTitle("");setRemainHTMLTag("");return;}
            let r=milisecondsToHms(remaintime/getPlayRate());
            showtabandfullvideo(r);
            if(getPlayRate()==1){setRemainHTMLTag(" (−"+r+")");}else{setRemainHTMLTag(" (−"+r+" "+getPlayRate()+"x speed)");}
        }
    }//end general video
    //console.log(": ",currenttime," ",totaltime);
}
function isLive(){
    let result=false;
    let node=document.querySelector('span.ytp-time-duration');
    node=node.parentElement.parentElement;
    let text=node.getAttribute("class");
    if(text.indexOf("ytp-live")!=-1){
        result=true;
    }
    return result;
}
function isFullScreenVideo(){
   let result=false;
   let v=document.querySelector('#movie_player');
   if(v!=null){result=v.isFullscreen();}
   return result;
}
function isFullWebVideo(){
    let result=false;
    const player = document.getElementById('movie_player');
    if (player) {
        const playerHeight = player.getBoundingClientRect().height;
        const windowHeight = window.innerHeight;
        const isFullHeight = Math.abs(playerHeight - windowHeight) < 1; // 容許誤差 1px
        if(isFullHeight&&!isFullScreenVideo()){
            result=true;
        }
    }
  return result;
}
function getPlayRate(){
   let rate=1;
   let v=document.querySelector('#movie_player');
   if(v!=null){rate=v.getPlaybackRate();}
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
       let node=document.querySelector('span.ytp-time-duration');
       node=node.parentElement;
       let x=q.create("span",id,null);
       node.appendChild(x);
   }else{
       n.innerText=text;
   }
}
function setRemainHTMLTagOnFullVideo(text,show){

   let id="smallsupo_remaintime_fullvideo";
   let n=document.getElementById(id);
   if(n==null){
       let node=document.querySelector('div.html5-video-container');
       node=node.parentElement;
       let x=q.create("div",id,null);
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
function initStart(){

}
function initAfterTitle(){
       urlchanging=false;
        totaltime=getVideoTotalTime();
        totaltime=HmsToMiliseconds(totaltime);
        remaintime=undefined;
        setRemainHTMLTag("");
        startObserver();

}
function init1(){

    waitForElementObserver('#above-the-fold',(dom)=>{
    let titlecontainer=dom.querySelector('yt-formatted-string');
        title= titlecontainer.getAttribute("title");initAfterTitle();
        console.log(title+" 1:"+totaltime);
    },()=>{title=document.title;console.log(title+" 2:"+totaltime);initAfterTitle();},5);

    //title=document.title;

}
function init(){
    urlchanging=false;
 //title=document.title;
        totaltime=getVideoTotalTime();
        //console.log(title+":"+totaltime);
        totaltime=HmsToMiliseconds(totaltime);
        remaintime=undefined;
        setRemainHTMLTag("");
        startObserver();
}
async function uninit(){
    if(debug)console.log("uninit");
    stopObserver();
    //await delay(1000);
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
    let node=document.querySelector('#movie_player');
    observer.observe(node,{attributes:true,childList:false,subtree:false,attributeFilter:['class']});
}
let titleObserver=null;
function stopTitleObserver(){
    if(titleObserver!=null){
    if(debug)console.log("stopTitleObserver");
      titleObserver.disconnect();titleObserver=null;
    }
}
function startTitleObserver(dom){
    if(debug)console.log("startTitleObserver");
    titleObserver=new MutationObserver(()=>{title=dom.getAttribute('title');});
    titleObserver.observe(dom,{attributes:true,childList:false,subtree:false,attributeFilter:['title']});
}
//---------------------------------------
function watchUrlChange(callback) {
  let lastUrl = location.href;

  // ✅ DOM ready 後執行 callback
  function waitForDOMReady(cb) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(cb, 50);
    } else {
      window.addEventListener('DOMContentLoaded', () => cb(), { once: true });
    }
  }

  // ✅ 檢查網址是否改變
  const onUrlChange = () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      waitForDOMReady(callback);
    }

  };

  // ✅ MutationObserver：觀察 DOM 是否有變動（例如 SPA 路由切換）
  const observer = new MutationObserver(onUrlChange);
  observer.observe(document, { childList: true, subtree: true });

  // ✅ 捕捉 pushState / replaceState
  ['pushState', 'replaceState'].forEach(method => {
    const original = history[method];
    history[method] = function () {
      original.apply(this, arguments);
      window.dispatchEvent(new Event('urlchange'));
    };
  });

  // ✅ 監聽瀏覽器前進/後退 或 push/replace 狀況
  window.addEventListener('popstate', onUrlChange);
  window.addEventListener('urlchange', onUrlChange);

  // ✅ 初始觸發一次
  waitForDOMReady(callback);
}

function waitForElementObserver(selector, functionX, functionY, timeoutSeconds) {
    let timeoutId = null;
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      if (timeoutId) clearTimeout(timeoutId); // 若有 timeout，清除它
      observer.disconnect();
      functionX(element);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const existing = document.querySelector(selector);
  if (existing) {
    if (timeoutId) clearTimeout(timeoutId);
    observer.disconnect();
    functionX(existing);
    return;
  }

  // ✅ 只有在 functionY 和 timeoutSeconds 都有提供時才啟用 timeout 行為
  if (typeof functionY === 'function' && typeof timeoutSeconds === 'number') {
    timeoutId = setTimeout(() => {
      observer.disconnect();
      functionY();
    }, timeoutSeconds * 1000);
  }
}
//--------------------------------------
const debug=false;
function setUI(){

    urlchanging=true;
    uninit();
    if(/www.youtube.com\/watch/.test(window.location.href)){
         waitForElementObserver('#above-the-fold',(dom)=>{
             let titlecontainer=dom.querySelector('yt-formatted-string');
                                startTitleObserver(titlecontainer);
         });
        //waitForElementObserver('#movie_player',
          waitForElementObserver('video',
                               ()=>{
           let timer;
             clearTimeout(timer);
            timer=setTimeout(function() {
                init();
            }, 500);

        });
    }else{
        stopTitleObserver();
    }
}
setTimeout(function() {
     const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) {
        console.log("Browser is Firefox");
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            window.trustedTypes.createPolicy('default', {
                createHTML: (string, sink) => string
            });
        }
    }
    console.log("Youtube-video remain time on tab title...啟動")
    title=document.title;
    watchUrlChange(setUI);
}, 1000);