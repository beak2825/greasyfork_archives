// ==UserScript==
// @name         Copy Album Track Listings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  tCopy the fuckin traqck list idk shut up
// @author       Mangofuckboy
// @match        https://store.steampowered.com/app/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/542654/Copy%20Album%20Track%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/542654/Copy%20Album%20Track%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('button');
    button.innerText = 'Copy Track Listing';

    button.style.margin = '8px';
    button.style.padding = '3px 12px';
    button.display = 'inline';
    button.style.backgroundColor = 'transparent';
    button.style.border = '1px solid rgba(255,255,255,.4)';
    button.style.color = '#fff';
    button.style.cursor = 'pointer';
    button.width = 'fit-content';

    const descriptionElement = document.querySelector('#music_album_area_description > h2');
    if (descriptionElement) {
        descriptionElement.appendChild(button);

        button.addEventListener('click', function() {
            const trackListingDiv = document.querySelector('.music_album_track_listing_table');
            if (trackListingDiv) {

                let trackList = '';

                const trackElements = trackListingDiv.querySelectorAll('.music_album_track_ctn');
                trackElements.forEach(function(trackElement) {
                    const trackNumber = trackElement.querySelector('.music_album_track_number').textContent.trim();
                    const trackName = trackElement.querySelector('.music_album_track_name').textContent.trim();
                    trackList += `${trackNumber}. ${trackName}\n`;
                });

                try {
                    GM_setClipboard(trackList);
                    console.info('Track listing copied to clipboard!');
                } catch (err) {
                    console.error('Failed to copy track listing.');
                }

            } else {
                console.info('Track listing not found.');
            }
        });
    } else {
        console.error('Music album description element not found.');
    }
})();