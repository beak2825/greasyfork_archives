// ==UserScript==
// @name         CSDNRemoveCopyright
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除CSDN copyright信息(保留格式)
// @author       Ritter
// @match        https://blog.csdn.net/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/390502/CSDNRemoveCopyright.user.js
// @updateURL https://update.greasyfork.org/scripts/390502/CSDNRemoveCopyright.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 其他方法 csdn.copyright.textData = ""; 这个方法不会保留格式
    // 这种方法可以保留复制的格式 
    Object.defineProperty(window, "articleType", {
        value: 0,
        writable: false,
        configurable: false
    });
})();