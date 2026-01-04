// ==UserScript==
// @name         修改Issues页面宽度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/*/issues/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371488/%E4%BF%AE%E6%94%B9Issues%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/371488/%E4%BF%AE%E6%94%B9Issues%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.innerHTML = '.container{ min-width: 90%} .discussion-timeline { min-width: calc(100% - 220px)}';
    document.head.appendChild(style);
    // Your code here...
})();