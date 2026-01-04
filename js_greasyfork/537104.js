// ==UserScript==
// @name         YouTube Caption Window Resizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Sets YouTube caption window width to 100%, unsets left property, and centers text.
// @author       Your Name
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537104/YouTube%20Caption%20Window%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/537104/YouTube%20Caption%20Window%20Resizer.meta.js
// ==/UserScript==

(
    function()
    {
        'use strict';

        const applyCaptionStyles = () =>
        {
            const captionWindow = document.querySelector('.caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup');
            if (captionWindow)
            {
                captionWindow.style.width = '100%';
                captionWindow.style.left = ''; // Unsets the left property
                captionWindow.style.textAlign = 'center';
                console.log('Caption window styles applied.');
            }
        };

        // Use a MutationObserver to detect when the caption window is added to the DOM
        const observer = new MutationObserver
        (
            (mutationsList) =>
            {
                for (const mutation of mutationsList)
                {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0)
                    {
                        // Check if the added node is the caption window or contains it
                        if( mutation.addedNodes[0].classList && mutation.addedNodes[0].classList.contains('caption-window') || mutation.addedNodes[0].querySelector('.caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup'))
                        {
                            applyCaptionStyles();
                        }
                    }
                    else if (mutation.type === 'attributes' && mutation.target.classList.contains('caption-window'))
                    {
                        // Reapply styles if caption window attributes change (e.g., visibility)
                        applyCaptionStyles();
                    }
                }
            }
        );

        // Start observing the body for changes
        observer.observe
        (
            document.body,
            {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class'] // Observe changes to style and class attributes
            }
        );

        // Also apply styles on initial load, in case the caption window is already present
        applyCaptionStyles();
    }
)();