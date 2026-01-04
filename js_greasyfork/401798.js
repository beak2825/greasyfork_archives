// ==UserScript==
// @name         任意修改页面文字
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一行代码即可修改任意网页内容
// @author       Priate
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/401798/%E4%BB%BB%E6%84%8F%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/401798/%E4%BB%BB%E6%84%8F%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.contentEditable = "true";
})();