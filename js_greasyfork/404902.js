// ==UserScript==
// @name         Youtube 自动加载字幕
// @namespace    Youtube Automatically load subtitles
// @version      1.1
// @description  Youtube自动加载字幕
// @author       Jahn
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404902/Youtube%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/404902/Youtube%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function(){
    let btn = document.querySelector('.ytp-subtitles-button');
    if(btn.getAttribute('aria-pressed') === 'false') btn.click();
})()