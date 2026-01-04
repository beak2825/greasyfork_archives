// ==UserScript==
// @name         b站视频无法加载恶搞助手
// @namespace    DuckBurnIncense
// @version      0.0.4
// @description  none
// @author       DuckBurnIncense
// @match        *://www.bilibili.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433985/b%E7%AB%99%E8%A7%86%E9%A2%91%E6%97%A0%E6%B3%95%E5%8A%A0%E8%BD%BD%E6%81%B6%E6%90%9E%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433985/b%E7%AB%99%E8%A7%86%E9%A2%91%E6%97%A0%E6%B3%95%E5%8A%A0%E8%BD%BD%E6%81%B6%E6%90%9E%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var int=setInterval("document.querySelector('video').playbackRate=0",100);

