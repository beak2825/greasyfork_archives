// ==UserScript==
// @license MIT
// @name         爱同桌精读快捷键
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  爱同桌精读训练快捷键
// @author       You
// @match        https://*.itongzhuo.com/business/listen/stu/jumpIntensiveListening.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itongzhuo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478840/%E7%88%B1%E5%90%8C%E6%A1%8C%E7%B2%BE%E8%AF%BB%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/478840/%E7%88%B1%E5%90%8C%E6%A1%8C%E7%B2%BE%E8%AF%BB%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

   window.onkeydown = function(event) {
       if (document.activeElement == 'TEXTAREA' && document.activeElement.readOnly == false) {
           return;
       }
       switch (event.key) {
           case ' ':
               vm.pauseAudio();
               event.preventDefault();
               break;
           case 'p':
               vm.playListenAudio(-1);
               event.preventDefault();
               break;
           case 'n':
               vm.playListenAudio(1);
               event.preventDefault();
               break;
           case 'l':
               vm.audioLoopPlay(1);
               event.preventDefault();
               break;
           case 'j':
               vm.endTime = audio.currentTime;
               event.preventDefault();
               break;
           case 'J':
               vm.endTime += 1;
               event.preventDefault();
               break;
           case 'h':
               vm.startTime -= 1;
               event.preventDefault();
               break;
           case 'H':
               vm.startTime += 1;
               event.preventDefault();
               break;
           case 'M':
               vm.toggleEnshrine();
               event.preventDefault();
               break;
           case 'm': {
               var currentIndex = vm.chooseIndex;
               var listener = vm.mockListenList[currentIndex];
               var status = listener.enshrineListenId>0 ? 1 : 0;
               event.preventDefault();
               vm.onEnshrine(listener, listener.listId, status)
               break;
           }
       }
   }
})();