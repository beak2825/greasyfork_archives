// ==UserScript==
// @name         Echo360 Enhanced (功能增强)
// @namespace    http://echo360.so/why_the_website_is_so_terrible/
// @version      0.1
// @description  显示Echo360视频时间/点击屏幕播放暂停 Show current time / Click on the screen to play
// @name:en      Echo360 Enhanced
// @description:en    Show current time / Click on the screen to play
// @author       Yui
// @include      *echo360.*/lesson/*
// @icon         https://www.google.com/s2/favicons?domain=echo360.org.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437952/Echo360%20Enhanced%20%28%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437952/Echo360%20Enhanced%20%28%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try{$('.screens')[0].addEventListener("click",(()=>{$('.play-btn')[0].click();}));$('.currTime')[0].style.display='inline'}catch(error){window.onload=function(){console.log('cache not exist');$('.screens')[0].addEventListener("click",(()=>{$('.play-btn')[0].click();}));$('.currTime')[0].style.display='inline'}}
})();