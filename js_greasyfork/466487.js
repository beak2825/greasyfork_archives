// ==UserScript==
// @name         ChatGpt full screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the style to support ChatGPT chat to full screen
// @author       You
// @match        https://chat.openai.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466487/ChatGpt%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/466487/ChatGpt%20full%20screen.meta.js
// ==/UserScript==

(function() {
    'use strict';
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.text-base { max-width: 100% !important;padding-left:10px }');
    // Your code here...
})();