// ==UserScript==
// @name         起点自动登录
// @namespace    http://tampermonkey.net/
// @version      2024-06-24
// @description  起点自动登录1
// @author       You
// @match        https://www.qidian.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500383/%E8%B5%B7%E7%82%B9%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/500383/%E8%B5%B7%E7%82%B9%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(() => {
        let v = document.querySelector("#user-name")?.innerhtml
        if (v=== null || v === "" || typeof(v) !== "string") {
             document.querySelector("#login-btn")?.click()
        }
    }, 3000);
})();