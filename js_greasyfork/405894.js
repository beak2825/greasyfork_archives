// ==UserScript==
// @name         coder animal life matters
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除灰色滤镜，恢复代码高亮
// @author       mian
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405894/coder%20animal%20life%20matters.user.js
// @updateURL https://update.greasyfork.org/scripts/405894/coder%20animal%20life%20matters.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('body').style.filter = 'none'
    // Your code here...
})();