// ==UserScript==
// @name         替代新时代为后现代
// @namespace    http://tampermonkey.net/
// @version      0.1111
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40383/%E6%9B%BF%E4%BB%A3%E6%96%B0%E6%97%B6%E4%BB%A3%E4%B8%BA%E5%90%8E%E7%8E%B0%E4%BB%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/40383/%E6%9B%BF%E4%BB%A3%E6%96%B0%E6%97%B6%E4%BB%A3%E4%B8%BA%E5%90%8E%E7%8E%B0%E4%BB%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.body.innerHTML = document.body.innerHTML.replace(/新时代/g, '后现代');
    // Your code here...
})();