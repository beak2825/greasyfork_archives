// ==UserScript==
// @name         隐藏B站AI总结浮窗
// @namespace    http://blog.3gxk.net/
// @version      2024-03-04
// @description  在B站上，鼠标放在视频上时会显示一个AI总结浮窗，但是它会遮挡一些东西，该插件可隐藏该浮窗
// @author       Curtion
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488890/%E9%9A%90%E8%97%8FB%E7%AB%99AI%E6%80%BB%E7%BB%93%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/488890/%E9%9A%90%E8%97%8FB%E7%AB%99AI%E6%80%BB%E7%BB%93%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('#biliscope-video-card{display:none !important}')
})();