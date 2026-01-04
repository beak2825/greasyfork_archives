// ==UserScript==
// @name         YouTube Music Featuring Rename
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Renomeia de "part." para "feat."
// @author       Valdinei Ferreira
// @include      https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438492/YouTube%20Music%20Featuring%20Rename.user.js
// @updateURL https://update.greasyfork.org/scripts/438492/YouTube%20Music%20Featuring%20Rename.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the node that will be observed for mutations
    let el = document.querySelector('.title.ytmusic-player-bar');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        if (el.title.includes('part.')) {
            el.textContent = el.textContent.replace('part.', 'feat.');
            el.title = el.title.replace('part.', 'feat.');
        } else {
            el.textContent = el.title;
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(el, config);
})();