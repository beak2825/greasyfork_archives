// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-05-20
// @description  hide unnecessary info
// @author       You
// @license      MIT
// @match        https://pokerogue.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokerogue.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495552/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/495552/New%20Userscript.meta.js
// ==/UserScript==
var style = document.createElement("style");
document.head.appendChild(style);
style.sheet.insertRule(`div[class*='text-base'] { display: none;}`);


(function() {
    'use strict';

    // Your code here...
})();