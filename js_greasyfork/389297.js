// ==UserScript==
// @name         douyu.com night mode
// @name:zh-CN   斗鱼网页夜间模式
// @name:zh-TW   斗魚網頁夜間模式
// @namespace    https://greasyfork.org/users/282572
// @homepageURL     https://github.com/yaozeye/javascript
// @version      1.0.1
// @description  Make background black on douyu.com
// @description:zh-CN   网页端斗鱼(douyu.com)黑色背景
// @description:zh-TW   網頁端斗魚(douyu.com)黑色背景
// @author       yaozeye
// @copyright   2019, yaozeye
// @match        *://douyu.com/*
// @match        *://*.douyu.com/*
// @grant        none
// @run-at       document-end
// @license MIT https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/389297/douyucom%20night%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/389297/douyucom%20night%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.style.background="#000";
    document.body.style.color="#fff";
})();
