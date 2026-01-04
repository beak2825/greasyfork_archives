// ==UserScript==
// @name         Replace flags on pixelplanet.fun
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license      MIT
// @description  Replace GIFs with the names ua.gif, ru.gif, and by.gif on pixelplanet.fun
// @author       Cossack (join ukraine on ppf t.me/pixelplanetukr)
// @match        https://pixelplanet.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483477/Replace%20flags%20on%20pixelplanetfun.user.js
// @updateURL https://update.greasyfork.org/scripts/483477/Replace%20flags%20on%20pixelplanetfun.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace GIFs
    function replaceGIFs() {
        // Get all images on the page
        var images = document.getElementsByTagName('img');

        // Loop through each image
        for (var i = 0; i < images.length; i++) {
            // Check if the image source contains 'ua.gif', 'ru.gif', or 'by.gif' (case-insensitive)
            if (images[i].src.toLowerCase().includes('ua.gif')) {
                // Replace the image source for ua.gif
                images[i].src = 'https://raw.githubusercontent.com/thetemmi/flaggifs/main/ua.gif';
            } else if (images[i].src.toLowerCase().includes('ru.gif')) {
                // Replace the image source for ru.gif
                images[i].src = 'https://raw.githubusercontent.com/thetemmi/flaggifs/main/ru.gif';
            } else if (images[i].src.toLowerCase().includes('by.gif')) {
                // Replace the image source for by.gif
                images[i].src = 'https://raw.githubusercontent.com/thetemmi/flaggifs/main/by.gif';
            }
        }
    }

    // Create a MutationObserver to detect changes in the DOM
    var observer = new MutationObserver(replaceGIFs);

    // Options for the observer (in this case, we're observing changes to the subtree)
    var observerConfig = { subtree: true, childList: true };

    // Start observing the target node for configured mutations
    observer.observe(document.body, observerConfig);

    // Replace GIFs on page load
    replaceGIFs();
})();
