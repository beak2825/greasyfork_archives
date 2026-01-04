// ==UserScript==
// @name         慕课网自动播放下一节视频脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  节省体力。
// @author       xrr2016
// @match        *://*.imooc.com/*
// @icon         https://www.imooc.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39217/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/39217/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var playNextBtn = document.querySelector('div.J-next-btn');

var loop = setInterval(function () {
   if (!playNextBtn.classList.contains('hide')) {
     console.log('end');
     playNextBtn.dispatchEvent(new MouseEvent('click'));
   }
}, 500);