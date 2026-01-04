// ==UserScript==
// @name         自动打开b站的字幕
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动打开b站的字幕，每条视频都会
// @author       小伍
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493515/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80b%E7%AB%99%E7%9A%84%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/493515/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80b%E7%AB%99%E7%9A%84%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    let s = null;
    let hrefId = window.location.href;
    window.onload = function() {
        testTime();
    };
    setInterval(function (){
        let thisId = window.location.href;
        if(thisId !== hrefId){
            if (s) {
                clearInterval(s);
            }
            testTime();
            hrefId = thisId;
        }
    },100);
    function testTime(){
        s = setInterval(function (){
            let classS = document.getElementsByClassName('bpx-common-svg-icon');
            if(classS.length >= 23){
                for(let i = 0;i < classS.length;i++){
                    if(classS[i].parentElement.parentElement.getAttribute('aria-label') == '字幕'){
                        classS[i].click();
                        clearInterval(s);
                        return;
                    }
                }
            }
        },100);
    }
})();