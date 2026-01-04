// ==UserScript==
// @name         Highlight Premium Songs and Verified/Authenticated Artists
// @namespace    http://tampermonkey.net/
// @version      2024-10-21
// @description  Cover premium-only songs in transparent red and highlight verified/authenticated artists in green if not premium
// @author       You
// @match        *://audiomack.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audiomack.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/516620/Highlight%20Premium%20Songs%20and%20VerifiedAuthenticated%20Artists.user.js
// @updateURL https://update.greasyfork.org/scripts/516620/Highlight%20Premium%20Songs%20and%20VerifiedAuthenticated%20Artists.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to highlight premium songs
    function highlightPremiumSongs() {
        // Select all elements that contain the specific premium message
        let premiumSongs = document.querySelectorAll("p[aria-live='polite']");

        premiumSongs.forEach(song => {
            if (song.innerText.includes("This song is only available for premium subscribers")) {
                let resultWrapper = song.closest('.music-showcase_MusicShowcaseWrapper__jpYXy');
                if (resultWrapper) {
                    resultWrapper.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Apply transparent red
                }
            }
        });
    }

    // Function to highlight verified or authenticated artists in green if not premium
    function highlightVerifiedAuthenticatedArtists() {
        // Select all elements with 'Authenticated Artist' or 'Verified Artist' tooltips
        let artistBadges = document.querySelectorAll("span[aria-label='Authenticated Artist'], span[aria-label='Verified Artist']");

        artistBadges.forEach(badge => {
            let resultWrapper = badge.closest('.music-showcase_MusicShowcaseWrapper__jpYXy');
            if (resultWrapper) {
                // Check if this artist's song is not premium
                let isPremium = resultWrapper.querySelector("p[aria-live='polite']")?.innerText.includes("This song is only available for premium subscribers");

                // If not premium, apply a green background
                if (!isPremium) {
                    resultWrapper.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
                }
            }
        });
    }

    // Run the functions on page load
    window.addEventListener('load', () => {
        highlightPremiumSongs();
        highlightVerifiedAuthenticatedArtists();
    });

    // Observe changes in the DOM in case new results are loaded dynamically
    let observer = new MutationObserver(() => {
        highlightPremiumSongs();
        highlightVerifiedAuthenticatedArtists();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
