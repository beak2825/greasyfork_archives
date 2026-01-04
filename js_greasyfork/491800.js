// ==UserScript==
// @name         Enable Text Copying newxboxone.ru
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables text copying on newxboxone that block it
// @author       you
// @match        https://newxboxone.ru/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491800/Enable%20Text%20Copying%20newxboxoneru.user.js
// @updateURL https://update.greasyfork.org/scripts/491800/Enable%20Text%20Copying%20newxboxoneru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove event listeners that disable text selection
    document.body.onselectstart = null;
    document.body.onmousedown = null;
    document.body.onkeydown = null;

    // Remove inline styles that disable text selection
    document.body.style.cursor = 'auto';
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
    document.body.style.MozUserSelect = 'auto';

    // Remove the script tags that block copying
    var scripts = document.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if (script.textContent.includes('disableSelection') || script.textContent.includes('disable_keystrokes')) {
            script.parentNode.removeChild(script);
        }
    }

    // Allow copying by overriding the copy event listener
    document.addEventListener("copy", (event) => {
        // Do nothing to allow normal copying behavior
    });
})();