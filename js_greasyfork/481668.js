// ==UserScript==
// @name         booklive-image-redirect
// @namespace    https://greasyfork.org/users/1203219
// @version      0.1
// @description  右键打开 booklive 封面原图
// @author       harutya
// @match        *://booklive.jp/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481668/booklive-image-redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/481668/booklive-image-redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Listen for the contextmenu event (right-click)
    document.addEventListener('contextmenu', function(event) {
        // Check if the right-clicked element is an image
        const target = event.target;
        if (target.tagName === 'IMG') {
            // Get the current image source URL
            const currentSrc = target.src;

            // Check if the URL matches the BookLive pattern
            const bookLivePattern = /https:\/\/res\.booklive\.jp\/(\d+)\/(\d+)\/thumbnail\/([^\/.]+)\.([^\/.]+)/;
            const match = currentSrc.match(bookLivePattern);

            if (match) {
                // Replace the matched pattern with 'X.<ext>'
                const newSrc = currentSrc.replace(match[0], `https://res.booklive.jp/${match[1]}/${match[2]}/thumbnail/X.${match[4]}`);

                // Open the new URL in a new tab
                window.open(newSrc, '_blank');

                // Prevent the default context menu
                event.preventDefault();
            }
        }
    });
})();