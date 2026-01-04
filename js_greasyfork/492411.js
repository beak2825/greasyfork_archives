// ==UserScript==
// @name         enaea学习公社-大学生网络党课-佑安宝-山西恒安-中国教育干部网络学院-接所有视频类网课平台，秒刷加我vx:shuake345
// @namespace    倍速秒刷请加（VX）：shuake345
// @version      0.4
// @description  本版本为常速播放|基本满足所有人员|倍速秒刷请加（VX）：shuake345
// @author       （VX）：shuake345
// @match        *//study.enaea.edu.cn/*
// @match        *://study.enaea.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492411/enaea%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE-%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%BD%91%E7%BB%9C%E5%85%9A%E8%AF%BE-%E4%BD%91%E5%AE%89%E5%AE%9D-%E5%B1%B1%E8%A5%BF%E6%81%92%E5%AE%89-%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E6%8E%A5%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%B1%BB%E7%BD%91%E8%AF%BE%E5%B9%B3%E5%8F%B0%EF%BC%8C%E7%A7%92%E5%88%B7%E5%8A%A0%E6%88%91vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/492411/enaea%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE-%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%BD%91%E7%BB%9C%E5%85%9A%E8%AF%BE-%E4%BD%91%E5%AE%89%E5%AE%9D-%E5%B1%B1%E8%A5%BF%E6%81%92%E5%AE%89-%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E6%8E%A5%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%B1%BB%E7%BD%91%E8%AF%BE%E5%B9%B3%E5%8F%B0%EF%BC%8C%E7%A7%92%E5%88%B7%E5%8A%A0%E6%88%91vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
    } else if (document.visibilityState == "visible") {
        if(document.URL.search('circleIndexRedirect.do')>1){setTimeout(sx,1000)}
    }
});

    function sx(){
        window.location.reload()
    }

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
    function Qt(){
            document.getElementById('guide-title').querySelector('a').innerText='代刷vx:shuake345'
    }
    setTimeout(Qt,2141)
   function ss(){
      if(document.getElementsByClassName('customcur-tab-text').length>0){
          document.getElementsByClassName('customcur-tab-text')[1].click()
         // clearInterval(ss1)
      }
   }
 var ss1=setInterval(ss,1000)
 function bf(){
     if(document.URL.search('viewerforccvideo.do')>1){
     document.getElementsByTagName('video')[0].play()
     }
 }
    setInterval(bf,3000)
})();