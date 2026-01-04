// ==UserScript==
// @name         acfun关闭自动播放
// @namespace    荧之风
// @version      0.33
// @description  acfun turn off autoplay
// @author       荧之风
// @match        *.acfun.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/403613/acfun%E5%85%B3%E9%97%AD%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/403613/acfun%E5%85%B3%E9%97%AD%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function(window, self, unsafeWindow) {
    'use strict';
//sleep
         function sleep (time) {
             return new Promise((resolve) => setTimeout(resolve, time));
         }
//pause
    function pauseClcik()
    {
         try{
       let pb = document.querySelector('.btn-play');
         if (pb.querySelector('.btn-span').getAttribute('data-bind-attr')=='play')
             pb.click();
         }catch(err){ //console.log("pauseClcik error:"+err);
                    return sleep(500).then(() => {pauseClcik();
                    });}
    }
//autoplay
    function disableAutoPlay()
    {
         try{
         let setting = document.querySelectorAll('.control-checkbox');
         let ap=setting[1];
         if(ap.getAttribute('data-bind-attr')=='true')
             ap.click();
         }catch(err){ //console.log("disableAutoPlay error:"+err);
                      return sleep(500).then(() => {disableAutoPlay();
                    });}
    }
      pauseClcik();
      disableAutoPlay();
})();