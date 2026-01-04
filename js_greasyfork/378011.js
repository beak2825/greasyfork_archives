// ==UserScript==
// @name         远景论坛xhei字体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.pcbeta.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/378011/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9Bxhei%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/378011/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9Bxhei%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("body,input,button,select,textarea{font:12px '孤鹜 秀英丸'!important;}");
})();