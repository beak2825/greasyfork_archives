// ==UserScript==
// @name         CN-w3cschool-免登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  w3cschool免登录脚本
// @author       小明
// @match        https://www.w3cschool.cn/*
// @icon         https://7n.w3cschool.cn/statics/images/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456357/CN-w3cschool-%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/456357/CN-w3cschool-%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle('.widget-main {display:none !important}');
GM_addStyle('#topbanner {display:none !important}');
GM_addStyle('#rfbanner {display:none !important}');
GM_addStyle('.abox-content {display:none !important}');
GM_addStyle('.hot-icon {display:none !important}');
GM_addStyle('.portlet-title {display:none !important}');
GM_addStyle('.kn-btn-group {opacity: 0.1 !important}');
GM_addStyle('.vip-area {display:none !important}');

GM_addStyle('#header {opacity: 0.4 !important}');

    // Your code here...
})();