// ==UserScript==
// @name         enaea学习公社-配合fiddler
// @namespace    代刷vx：shuake345
// @version      0.1
// @description  代刷vx：shuake345
// @author       代刷vx：shuake345
// @match        *study.enaea.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473480/enaea%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE-%E9%85%8D%E5%90%88fiddler.user.js
// @updateURL https://update.greasyfork.org/scripts/473480/enaea%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE-%E9%85%8D%E5%90%88fiddler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
        console.log('隐藏');
        //window.close()
    } else if (document.visibilityState == "visible") {
        console.log('显示')
        if(document.URL.search('circleIndexRedirect.do')>1){setTimeout(sx,1000)}
    }
});

    function sx(){
        window.location.reload()
    }

//主页改变后点播放
function 主页(){
    if(document.URL.search('circleIndexRedirect.do')>1){
       if(sessionStorage.getItem('key')!==document.getElementsByClassName('course-title')[0].innerText){
       sessionStorage.setItem('key',document.getElementsByClassName('course-title')[0].innerText)
           document.getElementsByClassName('golearn  ablesky-colortip  saveStuCourse')[0].click()
       }else{
       clearInterval(zhuye1)
       setTimeout(sx,30000)
            }
    }
}
    var zhuye1=setInterval(主页,8000)

//次页
       function kc(){
           if(document.URL.search('viewerforccvideo.do')>1){
               if (document.querySelectorAll('div.dialog-button-container>button').length){document.querySelectorAll('div.dialog-button-container>button')[0].click()}
         var JD= document.getElementsByClassName('cvtb-MCK-CsCt-studyProgress')
         var jdlong=JD.length-1
         var dqJD=document.getElementsByClassName('cvtb-MCK-course-content current')
         if (JD.length>0){
             if(document.getElementsByClassName('cvtb-MCK-course-content current')[0].getElementsByClassName('cvtb-MCK-CsCt-studyProgress')[0].innerText=="100%"){
                 for (var i=0;i<JD.length;i++){
        if(JD[i].innerText!=='100%'){
            JD[i].click()
            console.log(JD[jdlong].innerText)
            setTimeout(bf,3000)
            break;
        }else if(i==jdlong && JD[jdlong].innerText){
            window.close()
        }
    }
             }

    }
           }
    }
setInterval(kc,9000)
//点击未学
   function ss(){
      if(document.getElementsByClassName('customcur-tab-text').length>0){
          document.getElementsByClassName('customcur-tab-text')[1].click()
         // clearInterval(ss1)
      }
   }
 var ss1=setInterval(ss,1000)
 //播放
 function bf(){
     if(document.URL.search('viewerforccvideo.do')>1){
     document.getElementsByTagName('video')[0].play()
         //document.getElementsByTagName('video')[0].playbackRate=6
     //console.log('播放中')
     }
 }
    setInterval(bf,3000)
})();