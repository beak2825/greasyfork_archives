// ==UserScript==
// @name         B站英雄联盟比赛页面隐藏比分
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  英雄联盟比赛页面隐藏比分
// @author       沐风悠扬
// @match        https://live.bilibili.com/*
// @icon         https://space.bilibili.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      mufengyouyang
// @downloadURL https://update.greasyfork.org/scripts/453196/B%E7%AB%99%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F%E6%AF%94%E8%B5%9B%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F%E6%AF%94%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/453196/B%E7%AB%99%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F%E6%AF%94%E8%B5%9B%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F%E6%AF%94%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle('.score{display:none !important}')

})();