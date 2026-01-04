// ==UserScript==
// @name         知乎免登陆
// @namespace    https://github.com/gaoliang/MyTampermonkey
// @version      0.1
// @description  知乎免登陆,css版
// @author       Gao Liang
// @match        www.zhihu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/417291/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/417291/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("知乎免登陆脚本执行中");
    GM_addStyle('.Modal-wrapper { display: none !important;}');
    GM_addStyle('html {overflow: scroll !important}');
    console.log("知乎免登陆脚本执行成功");
})();