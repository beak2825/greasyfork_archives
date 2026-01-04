// ==UserScript==
// @name         DoomWorld Instant DeSpoiler
// @namespace    https://www.doomworld.com/
// @version      1.0
// @description  Automatically opens spoilers on DoomWorld forum threads
// @author       @uaf on discord
// @match        https://www.doomworld.com/forum/topic/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469749/DoomWorld%20Instant%20DeSpoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/469749/DoomWorld%20Instant%20DeSpoiler.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to find and click spoilers
    function clickSpoilers() {
        var spoilers = document.querySelectorAll('.ipsSpoiler_header.ipsSpoiler_closed');
        spoilers.forEach(function(spoiler) {
            if (!spoiler.dataset.dwiClicked) {
                spoiler.click();
                spoiler.dataset.dwiClicked = true;
            }
        });
    }

    // Function to handle spoiler clicks
    function handleSpoilerClick(event) {
        var target = event.target;
        if (target.classList.contains('ipsSpoiler_header')) {
            target.dataset.dwiClicked = true;
        }
    }

    // Execute the function on page load
    window.addEventListener('load', function() {
        clickSpoilers();
    });

    // Execute the function when new content is loaded (e.g., infinite scroll)
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                clickSpoilers();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Add event listener to handle spoiler clicks
    document.addEventListener('click', handleSpoilerClick, true);
})();