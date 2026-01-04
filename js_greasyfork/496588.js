// ==UserScript==
// @name        notificatie wanneer Lekker Spelen de titel verandert
// @namespace   Violentmonkey Scripts
// @match       https://www.twitch.tv/lekkerspelen
// @grant       none
// @version     1.0
// @description 5/30/2024, 11:00:47 PM
// @downloadURL https://update.greasyfork.org/scripts/496588/notificatie%20wanneer%20Lekker%20Spelen%20de%20titel%20verandert.user.js
// @updateURL https://update.greasyfork.org/scripts/496588/notificatie%20wanneer%20Lekker%20Spelen%20de%20titel%20verandert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to play sound
    function playSound() {
        const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a'); // Replace with your sound file URL
        audio.play();
    }

    // Function to start observing the stream title element
    function observeTitle() {
        const titleElement = document.querySelector('[data-a-target="stream-title"]');

        if (titleElement)
        {
            // Observer to detect changes in the stream title
            const observer = new MutationObserver(mutations =>
            {
                mutations.forEach(mutation =>
                {
                    if (mutation.type === 'childList' || mutation.type === 'characterData')
                    {
                        playSound();
                    }
                });
            });

            // Start observing the stream title element for changes
            observer.observe(titleElement, { childList: true, characterData: true, subtree: true });
        }
        else
        {
            console.error('Title element not found');
        }
    }

    // Use MutationObserver to detect when the title element is added to the DOM
    const bodyObserver = new MutationObserver((mutations, observer) =>
    {
        if (document.querySelector('[data-a-target="stream-title"]'))
        {
            observeTitle();
            observer.disconnect(); // Stop observing once the title element is found and observed
        }
    });

    // Start observing the body for changes to detect when the title element is added
    bodyObserver.observe(document.body, { childList: true, subtree: true });

})();
