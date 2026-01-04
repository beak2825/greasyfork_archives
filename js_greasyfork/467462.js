// ==UserScript==
// @name         meow 隐藏弹幕以及广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于隐藏meow 的弹幕以及广告，方面阅读
// @author       You
// @match        https://meow.tg/
// @icon         https://meow.tg/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467462/meow%20%E9%9A%90%E8%97%8F%E5%BC%B9%E5%B9%95%E4%BB%A5%E5%8F%8A%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/467462/meow%20%E9%9A%90%E8%97%8F%E5%BC%B9%E5%B9%95%E4%BB%A5%E5%8F%8A%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // 主要是在使用的时候弹幕看得我眼花，一个简洁清爽的界面舒服多了，简单的写了一下大佬勿喷
setTimeout(()=>{
    var indexDisplay = document.getElementsByClassName('indexDisplay')
    var danmu = document.getElementsByClassName('danmu')
    if(indexDisplay.length){
        indexDisplay[0].remove()
    }
     if(danmu.length){
        danmu[0].remove()
    }
},100)
})();