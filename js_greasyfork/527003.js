// ==UserScript==
// @name         ChatGPT Show Edit Button
// @namespace    ChatGPT Tools by Vishanka
// @version      1.0
// @description  Restores the Copy and Edit button as a quick fix
// @author       Vishanka
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527003/ChatGPT%20Show%20Edit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527003/ChatGPT%20Show%20Edit%20Button.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Create a style element to impose our dominion over the hidden element.
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = "div.absolute.bottom-0.right-full.top-0 { display: block !important; left: -65px !important; }";


    // Append the style element to the document head or fallback to the document root.
    (document.head || document.documentElement).appendChild(style);
})();