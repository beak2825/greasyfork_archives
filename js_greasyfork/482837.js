// ==UserScript==
// @name         NYT Crossword Pencil Keyboard Shortcut
// @namespace    com.isabelgk
// @version      0.0.2
// @description  Set a keyboard shortcut for toggling the pencil tool on the NYT crossword
// @author       Isabel Kaspriskie
// @match        https://www.nytimes.com/crosswords/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482837/NYT%20Crossword%20Pencil%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/482837/NYT%20Crossword%20Pencil%20Keyboard%20Shortcut.meta.js
// ==/UserScript==


(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check if the pressed keys match the desired shortcut (Ctrl + P)
        if (event.ctrlKey && event.keyCode === 'P'.charCodeAt(0)) {
            var element = document.querySelector('.xwd__toolbar_icon--pencil');
            if (!element) {
                element = document.querySelector('.xwd__toolbar_icon--pencil-active');
            }

            element.closest('button').click();
        }
    });
})();
