// ==UserScript==
// @name         remove bilibili gray
// @namespace    Haxif
// @version      0.1
// @description  移除b站灰色主题
// @author       Haxif
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455756/remove%20bilibili%20gray.user.js
// @updateURL https://update.greasyfork.org/scripts/455756/remove%20bilibili%20gray.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("gray")[0].className = "";
})();