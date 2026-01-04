// ==UserScript==
// @name         Enhanced Page Interaction
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhance page interaction by removing copy-paste restrictions and bypassing screen switch detection
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490273/Enhanced%20Page%20Interaction.user.js
// @updateURL https://update.greasyfork.org/scripts/490273/Enhanced%20Page%20Interaction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function(e) {
        e.stopPropagation();
    }, true);

    document.addEventListener('cut', function(e) {
        e.stopPropagation();
    }, true);

    document.addEventListener('paste', function(e) {
        e.stopPropagation();
    }, true);

    Object.defineProperty(document, 'hidden', { value: false, writable: false });
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });

    window.addEventListener('blur', function() {
        window.focus();
    });

    window.addEventListener('focus', function() {
        document.title = 'On Class!';
    });

})();
