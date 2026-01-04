    // ==UserScript==
    // @name         Disboard - Hide NSFW servers
    // @version      0.5
    // @description  Hide server cards marked as NSFW, and prevent going to NSFW marked tags and servers
    // @author       hamxburger
    // @match        https://disboard.org/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=disboard.org
    // @grant        none
    // @license      MIT
    // @namespace https://greasyfork.org/users/1119831
// @downloadURL https://update.greasyfork.org/scripts/470257/Disboard%20-%20Hide%20NSFW%20servers.user.js
// @updateURL https://update.greasyfork.org/scripts/470257/Disboard%20-%20Hide%20NSFW%20servers.meta.js
    // ==/UserScript==

    (() => {
        'use strict';

        // !!! This will not work with servers or tags that aren't marked as NSFW !!! //
        // This does not hide NSFW search suggestions. However, if you click to go to the suggestion, you will be blocked from accessing it. //


        // -- Hide NSFW server cards on tag pages -- //

        const hideNsfwServerCards = () => {
            // Find all NSFW server labels
            const nsfwLabels = document.querySelectorAll('.server-nsfw');
            let nsfwServerCount = 0;

            // Loop through all labels
            for (let i = 0; i < nsfwLabels.length; i++) {
                const nsfwLabel = nsfwLabels[i];

                // Get the NSFW server card
                let serverCard = nsfwLabel.parentElement.parentElement.parentElement;

                // If serverCard is found, hide it
                if (serverCard) {
                    serverCard.style.display = 'none';
                    nsfwServerCount++;
                } else { // otherwise, log the error
                    console.error('Error: Failed to find server card for NSFW server #' + nsfwServerCount);
                }
            }
            console.log(nsfwServerCount + ' total NSFW servers hidden');

            // Remove any gaps at the top/middle of the page
            const brokenDiv = document.querySelector('.column.is-full');
            if (brokenDiv) {
                brokenDiv.remove();
                console.log('Fixed grid layout');
            } else {
                console.log('Grid layout is not broken');
            }
        };

        // Hide NSFW server cards
        hideNsfwServerCards();

        // Second time, just in case
        setTimeout(() => {
            hideNsfwServerCards();
        }, 500);



        // -- Go back when on a page's tag is marked as NSFW (meaning all servers on that page are NSFW) -- //

        const blockNsfwTagPage = () => {
            if (window.location.href.includes('https://disboard.org/servers/tag/')) {

                // Get the NSFW label next to the actual tag
                const nsfwTagLabel = document.querySelector('.tag-nsfw');

                // If the NSFW label exists, notify the user and go back to the previous page
                if (nsfwTagLabel) {
                    document.body.style.display = 'none';
                    setTimeout(() => {
                        alert('NSFW tag page was blocked; disable the script via your extensions to unblock. Press OK to go back to the previous page.');
                        window.history.back();
                    }, 50);
                }
            }
        };

        // Call the function to block NSFW tag pages
        blockNsfwTagPage();



        // -- Go back when on a server page marked as NSFW -- //

        const blockNsfwServerPage = () => {
            if (window.location.href.includes('https://disboard.org/server/')) {

                // Get the NSFW label under the server icon
                const nsfwServerLabel = document.querySelector('.server-nsfw');

                // If the NSFW label exists, notify the user and go back to the previous page
                if (nsfwServerLabel){
                    document.body.style.display = 'none';
                    setTimeout(() => {
                        alert('NSFW server page was blocked; disable the script via your extensions to unblock. Press OK to go back to the previous page.');
                        window.history.back();
                    }, 50);
                }
            }
        };

        // Call the function to block NSFW server pages
        blockNsfwServerPage();

    })();