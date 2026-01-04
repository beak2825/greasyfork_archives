// ==UserScript==
// @name         Copy no encode url
// @name:ja エンコードなしの URL をコピー
// @name:zh-TW 複製無編碼網址
// @name:zh-CN 复制无编码网址
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy no encode url to clipboard
// @description:ja  エンコードなしの URL をクリップボードにコピー
// @description:zh-CN  将无编码网址复制到剪贴板
// @description:zh-TW  將無編碼網址複製到剪貼板
// @author       貓咪不作戰
// @match *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462962/Copy%20no%20encode%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/462962/Copy%20no%20encode%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.addEventListener('mousedown', function () {
         var target = event.target || event.srcElement;
         if(event.button==1 && event.ctrlKey){
             var url= decodeURIComponent(window.location.href)
             console.log(url);
             navigator.clipboard.writeText(url)
             speak("Copy link")
         }
     })
    function speak(msgText) {
            var msg = new SpeechSynthesisUtterance(msgText);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(msg);
        }
    // Your code here...
})();