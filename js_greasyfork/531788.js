// ==UserScript==
// @name         Source Link Opener
// @namespace    http://tampermonkey.net/
// @match        *://gfxfather.com/*
// @version      0.1
// @description  Open links after "Source:" in a new tab
// @author       Druid
// @license MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531788/Source%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/531788/Source%20Link%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            let sourceText = document.body.innerText.match(/Source:\s*(https?:\/\/\S+)/i);
            if (sourceText && sourceText[1]) {
                window.open(sourceText[1], '_blank');
            }
        }
    });
})();
