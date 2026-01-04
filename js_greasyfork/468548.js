// ==UserScript==
// @name         哔哩哔哩播放合集高度调整
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调整哔哩哔哩播放合集高度，和播放器高度相同
// @author       yingming006
// @match        *www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/468548/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E5%90%88%E9%9B%86%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/468548/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E5%90%88%E9%9B%86%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
(function() {
    let css = `.video-sections-content-list{height: 580px !important;max-height:fit-content !important;}`
    GM_addStyle(css)
})();