// ==UserScript==
// @name         AntiNoOverflow
// @namespace    MXPSQL
// @license      MIT
// @version      0.1
// @description  Say goodbye to anti adblockers preventing scrolls. WARNING: This will affect all websites and it should be used with uBlock origin with the block element feature.
// @author       MXPSQL
// @match        *://*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Crystal_source.svg/64px-Crystal_source.svg.png
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.js
// @downloadURL https://update.greasyfork.org/scripts/443037/AntiNoOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/443037/AntiNoOverflow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i = 0;

    // Your code here...
    $(document).ready(function(){
        i = setInterval(function(){
            document.body.style.overflow = "initial";
            document.body.style.visibility = "initial";
        }, 1000);
    });
})();
