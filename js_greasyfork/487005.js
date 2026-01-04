// ==UserScript==
// @name         WaniKani Hide Meaning in Lessons
// @namespace    wanikani-hide-meaning
// @version      1.1.2
// @description  Hides the meaning in lessons on non-meaning tabs
// @author       Mystery
// @license      MIT
// @match        https://www.wanikani.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487005/WaniKani%20Hide%20Meaning%20in%20Lessons.user.js
// @updateURL https://update.greasyfork.org/scripts/487005/WaniKani%20Hide%20Meaning%20in%20Lessons.meta.js
// ==/UserScript==

;(function() {
    /* global wkof */
    'use strict';

    if (!window.wkof) {
        if (confirm('Hide Meaning in Lessons requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    let loaded = false;
    wkof.on_pageload([/\/subject-lessons\/(?:start|[\d-]+\/\d+)\/?$/], main, unload);
    wkof.on_pageload([/\/recent-mistakes\/*/], main, unload);


    function unload() {
        loaded = false;
    }

    function main() {
        if (loaded) {
            return;
        }
        loaded = true;
        // Insert CSS
        document.head.insertAdjacentHTML('beforeend',`
        <style name="hide_meaning" type="text/css">
            .character-header__characters:hover + .character-header__meaning {
                visibility: visible !important;
            }
            .character-header__meaning {
                visibility: hidden;
            }
        </style>
        `);

        // Detect tab changes
        window.addEventListener('hashchange', handleHashChange);

        function handleHashChange(event) {
            const meaning = document.querySelector('.character-header__meaning');
            if (!meaning) {
                return;
            }
            if (event.newURL.endsWith("#meaning")) {
                meaning.style.visibility = 'visible';
            } else {
                meaning.style.visibility = 'hidden';
            }
        }
    }
})();