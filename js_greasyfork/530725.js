// ==UserScript==
// @name daping329
// @namespace http://tampermonkey.net/
// @version 0.1
// @description 沉浸式大屏演示脚本
// @author zhang
// @match https://app.powerbi.com/*
// @license MIT
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530725/daping329.user.js
// @updateURL https://update.greasyfork.org/scripts/530725/daping329.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle('exploration-fullscreen-navigation{height:0px !important}')
    GM_addStyle('.master-form-factor{bottom:0px !important}')
    GM_addStyle('.statusBar{height:0px !important}')
    GM_addStyle('.scroll-bar-div{visibility:hidden !important}')
})();
