// ==UserScript==
// @name         Eloquent Javascript - Spanish - Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provides a dark mode for the Spanish version of Eloquent Javascript
// @author       erc2nd
// @match        https://eloquentjs-es.thedojo.mx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thedojo.mx
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449944/Eloquent%20Javascript%20-%20Spanish%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/449944/Eloquent%20Javascript%20-%20Spanish%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.style.background = "#2a2a2a";
    document.body.style.color = "#a4a6a5";

    const quote = document.querySelectorAll('blockquote p');
    for (let i = 0; i < quote.length; i++) {
        quote[i].style.color = "#a4a6a5";
    }

    const snippet = document.querySelectorAll('.snippet');
    for (let i = 0; i < snippet.length; i++) {
        snippet[i].style.backgroundColor = "#1b1b1b";
    }

    const cm_def = document.querySelectorAll('.cm-def');
    for (let i = 0; i < snippet.length; i++) {
        cm_def[i].style.color = "#f5d67b";
    }
})();