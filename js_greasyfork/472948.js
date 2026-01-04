// ==UserScript==
// @name         chinahrt类专技-天津专技-四川专技---通杀扫残版
// @namespace     Vx:shuake345
// @version      0.1
// @description  自动刷课|如果需要秒刷+Vx:shuake345
// @author       代刷Vx:shuake345
// @match        *.chinahrt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472948/chinahrt%E7%B1%BB%E4%B8%93%E6%8A%80-%E5%A4%A9%E6%B4%A5%E4%B8%93%E6%8A%80-%E5%9B%9B%E5%B7%9D%E4%B8%93%E6%8A%80---%E9%80%9A%E6%9D%80%E6%89%AB%E6%AE%8B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/472948/chinahrt%E7%B1%BB%E4%B8%93%E6%8A%80-%E5%A4%A9%E6%B4%A5%E4%B8%93%E6%8A%80-%E5%9B%9B%E5%B7%9D%E4%B8%93%E6%8A%80---%E9%80%9A%E6%9D%80%E6%89%AB%E6%AE%8B%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
 //配置参数界面

 //
       function oneJM(){
           if(document.URL.search('web.chinahrt.com/index.html#/v_selected_course')!==-1){
            console.log('vx:shuake345')
             var kc1=document.querySelectorAll('div.progress-line>span')
            for (var i = 0;i < kc1.length;i++){
                if(kc1[i].innerText=="0%"){
                 console.log('进入未学课程')
              document.getElementsByClassName('bg pa tc')[i].click()
                break;
             }
          }
       }else if(document.URL.search('web.chinahrt.com/index.html#/v_courseDetails')!==-1){
           console.log('发现次页')
           var kc2=document.querySelectorAll('a.button.fr.mt10.mr20.border-public.tc.f14.titlecolor')
           var sm= Number(kc2.length)
            for (var l = 0;l < kc2.length;l++){
                if(kc2[l].innerText.search('00:00')>0){
                    console.log('发现未学的'+l)
                    kc2[l].click()
                    window.location.reload()
                    break;
             }else if (kc2.length-1==l){
                 alert('初扫以完成，细扫请联系shuake345')
             window.history.go(-1)
             }
           }
       }//console.log('啥都没做')
    }
      function sxx(){
          if(document.URL.search('web.chinahrt.com/index.html#/v_courseDetails')!==-1){
           sx()
          }
 }
setInterval(sxx,20000)

    function openURL(){
        if(document.querySelector('iframe').src!==""){
            window.location.replace(document.querySelector('iframe').src)
           }else if(document.URL.search('videoadmin.chinahrt.com')>0){
               document.getElementsByTagName('video')[0].playbackRate=16
           document.getElementsByTagName('video')[0].play();
            player.videoMute();
           }
        }
    setInterval(openURL,5000)

    function closewindow(){
    if(document.URL.search('web.chinahrt.com/index.html#/v_proxy')>0){
    window.close()
    }
    }
    setInterval(closewindow,11000)

    function sx(){
        window.location.reload()
    }
    function ss(){
    if(document.visibilityState=='visible'){
        oneJM()
        console.log('zxjb')
    }
    }
    setInterval(ss,6000)

})();