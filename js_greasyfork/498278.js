// ==UserScript==
// @name         Add Spotify Button to Shazam
// @author       NWP
// @description  Adds a Spotify button to Shazam track pages
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        https://www.shazam.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498278/Add%20Spotify%20Button%20to%20Shazam.user.js
// @updateURL https://update.greasyfork.org/scripts/498278/Add%20Spotify%20Button%20to%20Shazam.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const addSpotifyButton = () => {
        const shareButton = document.querySelector('.TrackPageHeader_share__q1WWs');
        const spotifyButton = shareButton.cloneNode(true);
        const spotifyButtonLink = spotifyButton.querySelector('a');

        spotifyButtonLink.innerHTML = `<span class="Button-module_label__k1Dkf">
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png"
            style="width: 40px; height: 40px; margin-right: 15px; vertical-align: middle;">Spotify</span>`;
        spotifyButtonLink.style.padding = "7px 30px 7px 7px";
        spotifyButtonLink.querySelector('.Button-module_label__k1Dkf').style.cssText += 'color: #22ff83 !important;';

        const songTitle = document.querySelector('.TrackPageHeader_title__wGI_Q').textContent;
        const artistName = document.querySelector('meta[itemprop="name"]').content;
        const encodedSearch = encodeURIComponent(`${artistName} ${songTitle}`);

        spotifyButtonLink.href = `https://open.spotify.com/search/${encodedSearch}`;
        spotifyButtonLink.target = '_blank';

        const playButtonColor = document.querySelector('div.TrackPageHeader_parts__85FAC.TrackPageHeader_grid__EPCjO.TrackPageHeader_gridVertTop__yD4OZ').style.backgroundColor;
        spotifyButton.style.backgroundColor = playButtonColor;

        shareButton.parentNode.insertBefore(spotifyButton, shareButton);
    };

    const handleMutations = (mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && document.querySelector('.FloatingShazamButton_buttonContainer__DZGwL')) {
                addSpotifyButton();
                observer.disconnect();
                break;
            }
        }
    };

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
})();
