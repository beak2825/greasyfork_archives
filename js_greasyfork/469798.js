// ==UserScript==
// @name        Google Video Filter
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Hide non-youtube videos on Google video search results. Add toggle.
// @author      ChatGPT
// @match       https://www.google.com/search?*tbm=vid*
// @match       https://www.google.ca/search?*tbm=vid*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469798/Google%20Video%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/469798/Google%20Video%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let showHidden = false;

    // Function to toggle visibility of hidden divs
    function toggleVisibility() {
        showHidden = !showHidden;
        const hiddenDivs = document.querySelectorAll('#search div.g');
        for (let div of hiddenDivs) {
            const citeElement = div.querySelector('cite');
            if (citeElement && !citeElement.innerText.includes('youtube.com')) {
                div.style.display = showHidden ? '' : 'none';
            }
        }
    }

    // Function to check and hide non-youtube videos
    function hideNonYouTubeVideos() {
        const resultDivs = document.querySelectorAll('#search div.g');
        let hiddenCount = 0;

        for (let div of resultDivs) {
            const citeElement = div.querySelector('cite');
            if (citeElement && !citeElement.innerText.includes('youtube.com')) {
                div.style.display = 'none';
                hiddenCount++;
            }
        }

        // Find result-stats div and append message if any non-youtube items were hidden
        if (hiddenCount > 0) {
            const resultStats = document.querySelector('#result-stats');
            if (resultStats && resultStats.innerText.indexOf("Hidden") == -1) {
                resultStats.innerText += ` Hidden ${hiddenCount} non-youtube items. Click me to toggle\n`;
                resultStats.onclick = toggleVisibility;
            }
        }
    }

    // Initial check and hide operation
    hideNonYouTubeVideos();

    // Mutation observer to detect changes in search results
    const observer = new MutationObserver(hideNonYouTubeVideos);

    // Get the target node for observing changes
    const targetNode = document.querySelector('#search');

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();

