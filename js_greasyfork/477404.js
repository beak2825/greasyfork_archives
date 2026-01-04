// ==UserScript==
// @name         爱同桌错题页播放插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  控制爱同桌错题页播放
// @license      MIT
// @author       Zhutengfei
// @match        https://ielts.itongzhuo.com/business/ielts/student/jumpSingleReport.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itongzhuo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477404/%E7%88%B1%E5%90%8C%E6%A1%8C%E9%94%99%E9%A2%98%E9%A1%B5%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/477404/%E7%88%B1%E5%90%8C%E6%A1%8C%E9%94%99%E9%A2%98%E9%A1%B5%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var loopFlag = true;
       window.onkeydown = function(event) {
       switch (event.key) {
           case ' ':
               loopFlag = false;
               vm.pauseAudio();
               event.preventDefault();
               break;
           case 'p':
               vm.choose -= 1;
               vm.onChooseIndex(vm.choose, vm.choose);
               event.preventDefault();
               break;
           case 'n':
               vm.choose += 1;
               vm.onChooseIndex(vm.choose, vm.choose);
               event.preventDefault();
               break;
           case 'l':
               loopFlag = !loopFlag;
               event.preventDefault();
               break;
       }
   }
     audio.addEventListener('pause', function() {
         if (loopFlag) {
             vm.onChooseIndex(vm.choose, vm.choose);
         }
     }, false);
})();