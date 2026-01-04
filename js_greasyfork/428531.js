// ==UserScript==
// @name         通过背景音乐对网页进行后台保活
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过背景音乐对网页进行后台保活，请自行修改对应网站
// @author       天天发蛋糕
// @include        
// @include        
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428531/%E9%80%9A%E8%BF%87%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90%E5%AF%B9%E7%BD%91%E9%A1%B5%E8%BF%9B%E8%A1%8C%E5%90%8E%E5%8F%B0%E4%BF%9D%E6%B4%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/428531/%E9%80%9A%E8%BF%87%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90%E5%AF%B9%E7%BD%91%E9%A1%B5%E8%BF%9B%E8%A1%8C%E5%90%8E%E5%8F%B0%E4%BF%9D%E6%B4%BB.meta.js
// ==/UserScript==

var myAudio = new Audio('http://adventure.land/sounds/loops/empty_loop_for_js_performance.wav');
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();