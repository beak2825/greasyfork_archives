// ==UserScript==
// @name         RYM: Downvote all inherited genres
// @namespace    http://tampermonkey.net/
// @version      2025-03-08.1
// @description  Adds a button to download all "inherited" genres with 0 votes. Useful when you just added a bunch of genres to an album with many tracks.
// @author       w_biggs (~joks)
// @match        https://rateyourmusic.com/rgenre/set*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529146/RYM%3A%20Downvote%20all%20inherited%20genres.user.js
// @updateURL https://update.greasyfork.org/scripts/529146/RYM%3A%20Downvote%20all%20inherited%20genres.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const downvoteAllInherited = () => {
        const tracks = document.querySelectorAll('.trackselect_btn');

        let currentTrack = 1;
        let primariesDone = [];
        let secondariesDone = [];

        const primaries = document.querySelector('[id^=genreListlg]');
        const secondaries = document.querySelector('[id^=genreListls]');

        const observerCallback = (mutationList, observer, isPrimary) => {
            console.log('observer callback fired');
            const genres = mutationList[0].target.querySelectorAll('.genrea');

            if (genres) {
                for (const genre of genres) {
                    if (genre.textContent.includes('Inherited from release')) {
                        const buttons = genre.querySelectorAll('button.voting');
                        if (isPrimary) {
                            buttons[3].click();
                        } else {
                            buttons[1].click();
                        }
                        console.log('downvoted genre', genre.textContent);
                    }
                }

                if (isPrimary) {
                    primariesDone.push(tracks[currentTrack].id);
                } else {
                    secondariesDone.push(tracks[currentTrack].id);
                }
            }

            if (primariesDone.includes(tracks[currentTrack].id) && secondariesDone.includes(tracks[currentTrack].id)) {
                currentTrack++;
                if (tracks[currentTrack]) {
                    tracks[currentTrack].click();
                } else {
                    primariesObserver.disconnect();
                    secondariesObserver.disconnect();
                }
            }
        };

        const primaryCallback = (mutationList, observer) => {
            observerCallback(mutationList, observer, true);
        }

        const secondaryCallback = (mutationList, observer) => {
            observerCallback(mutationList, observer, false);
        }

        const primariesObserver = new MutationObserver(primaryCallback);
        const secondariesObserver = new MutationObserver(secondaryCallback);

        primariesObserver.observe(primaries, { childList: true });
        secondariesObserver.observe(secondaries, { childList: true });

        tracks[currentTrack].click();
    }

    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'Downvote all inherited genres';
    button.addEventListener('click', downvoteAllInherited);

    const form = document.querySelector('.votingbox form');

    form.appendChild(button);
})();