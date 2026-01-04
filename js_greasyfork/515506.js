// ==UserScript==
// @name         YouTube Embed Player on Watch Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace YouTube watch page player with the embed player for distraction-free viewing
// @author       GPT
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515506/YouTube%20Embed%20Player%20on%20Watch%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/515506/YouTube%20Embed%20Player%20on%20Watch%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get video ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v");

    if (videoId) {
        // Replace the entire body with an embedded player iframe
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #000;">
                <iframe width="100%" height="100%" style="border: none;" src="https://www.youtube.com/embed/${videoId}?autoplay=1" allowfullscreen></iframe>
            </div>
        `;
    }
})();
