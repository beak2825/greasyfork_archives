// ==UserScript==
// @name         彩色ctw
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  黑白变彩色
// @author       You
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/455822/%E5%BD%A9%E8%89%B2ctw.user.js
// @updateURL https://update.greasyfork.org/scripts/455822/%E5%BD%A9%E8%89%B2ctw.meta.js
// ==/UserScript==

(function() {
    'use strict';
let style = document.createElement("style");
style.innerHTML = "*{filter: none !important}";
document.head.appendChild(style);
    // Your code here...
})();