// ==UserScript==
// @name         修复Linux系统下有道词典无法发音问题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  修复Linux系统有道词典无法发音问题
// @author       You
// @match        *://dict.youdao.com/*
// @match        *youdao.com/w/*
// @grant        none
// @name:zh-TW   修復Linux系統下有道詞典無法發音的問題
// @description:zh-tw 修復Linux系統有道詞典無法發音的問題
// @downloadURL https://update.greasyfork.org/scripts/407721/%E4%BF%AE%E5%A4%8DLinux%E7%B3%BB%E7%BB%9F%E4%B8%8B%E6%9C%89%E9%81%93%E8%AF%8D%E5%85%B8%E6%97%A0%E6%B3%95%E5%8F%91%E9%9F%B3%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/407721/%E4%BF%AE%E5%A4%8DLinux%E7%B3%BB%E7%BB%9F%E4%B8%8B%E6%9C%89%E9%81%93%E8%AF%8D%E5%85%B8%E6%97%A0%E6%B3%95%E5%8F%91%E9%9F%B3%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newItem=document.createElement("audio");
    var demo = document.getElementsByClassName("s-btn")[0];
    demo.insertBefore(newItem,demo.childNodes[0]);

    var voice233 = document.getElementsByClassName('sp dictvoice voice-js log-js');
    for(let i=0; i<=voice233.length-1; i++){
        voice233[i].onclick = function(){
            document.getElementsByTagName('audio')[0].src = 'http://dict.youdao.com/dictvoice?audio=' + voice233[i].dataset.rel;
            document.getElementsByTagName('audio')[0].currentTime = 0;
            document.getElementsByTagName('audio')[0].play();
        }
    }
})();