// ==UserScript==
// @name         TornNoProgressBars
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove progress effects from energy, nerve, happy and life bars.
// @author       Resh
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/471068/TornNoProgressBars.user.js
// @updateURL https://update.greasyfork.org/scripts/471068/TornNoProgressBars.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return false; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    return true;
}

(function() {
    'use strict';

    let styleString = "div[class*=' progress-line-timer'],div[class^='progress-line-timer']{ visibility:hidden; }";

    // Your code here...
    if(!addGlobalStyle(styleString)) {
        // we were too fast and the document wasn't even loaded yet, let's just wait then
       document.addEventListener("DOMContentLoaded", function(event) {
           addGlobalStyle(styleString);
       })
   }
})();