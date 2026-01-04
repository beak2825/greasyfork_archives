// ==UserScript==
// @name         武汉电视台视频播放使用HTML5播放器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  武汉电视台视频播放替换掉原先的Flash播放器改为使用HTML5播放器
// @author       别问我是谁请叫我雷锋
// @match        http://app.cjyun.org/video/player/index*
// @match        https://app.cjyun.org/video/player/index*
// @match        http://app.hannews.com.cn/video/player/index*
// @match        https://app.hannews.com.cn/video/player/index*
// @license      BSD-3-Clause
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406239/%E6%AD%A6%E6%B1%89%E7%94%B5%E8%A7%86%E5%8F%B0%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%BD%BF%E7%94%A8HTML5%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/406239/%E6%AD%A6%E6%B1%89%E7%94%B5%E8%A7%86%E5%8F%B0%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%BD%BF%E7%94%A8HTML5%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==


'use strict';
document.getElementsByTagName("script")[1].remove();
// Your code here...
var x = function () {
    document.getElementById("a1").removeEventListener("DOMNodeInserted", x);
    IsPC = function () { return false; };
};

document.getElementById("a1").addEventListener("DOMNodeInserted", x);