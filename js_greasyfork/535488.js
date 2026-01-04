// ==UserScript==
// @name         Add Spotify and YouTube Buttons to Shazam
// @author       tanso
// @description  Adds Spotify and YouTube buttons to Shazam track pages
// @version      1.1
// @license      MIT
// @match        https://www.shazam.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/1467885
// @downloadURL https://update.greasyfork.org/scripts/535488/Add%20Spotify%20and%20YouTube%20Buttons%20to%20Shazam.user.js
// @updateURL https://update.greasyfork.org/scripts/535488/Add%20Spotify%20and%20YouTube%20Buttons%20to%20Shazam.meta.js
// ==/UserScript==
 
(() => {
    'use strict';

    const addSpotifyButton = () => {
        const shareButton = document.querySelector('.TrackPageHeader_share__q1WWs');
        if (!shareButton) return;

        const spotifyButton = shareButton.cloneNode(true);
        const spotifyButtonLink = spotifyButton.querySelector('a');

        spotifyButtonLink.innerHTML = `<span class="Button-module_label__k1Dkf">
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png"
            style="width: 40px; height: 40px; margin-right: 15px; vertical-align: middle;">Spotify</span>`;

        spotifyButtonLink.style.padding = "7px 30px 7px 7px";
        spotifyButtonLink.querySelector('.Button-module_label__k1Dkf').style.cssText += 'color: white !important;';
        spotifyButtonLink.style.backgroundColor = '#101218';

        const songTitle = document.querySelector('.TrackPageHeader_title__wGI_Q')?.textContent;
        const artistName = document.querySelector('meta[itemprop="name"]')?.content;
        if (!songTitle || !artistName) return;

        const encodedSearch = encodeURIComponent(`${artistName} ${songTitle}`);

        spotifyButtonLink.href = `https://open.spotify.com/search/${encodedSearch}`;
        spotifyButtonLink.target = '_blank';

        shareButton.parentNode.insertBefore(spotifyButton, shareButton);
    };

    const addYouTubeButton = () => {
        const shareButton = document.querySelector('.TrackPageHeader_share__q1WWs');
        if (!shareButton) return;

        const youtubeButton = shareButton.cloneNode(true);
        const youtubeButtonLink = youtubeButton.querySelector('a');

        youtubeButtonLink.innerHTML = `<span class="Button-module_label__k1Dkf">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/YouTube_icon_%282013-2017%29.png/800px-YouTube_icon_%282013-2017%29.png"
            style="width: 40px; height: 40px; margin-right: 15px; vertical-align: middle; border-radius: 50%;">YouTube</span>`;

        youtubeButtonLink.style.padding = "7px 30px 7px 7px";
        youtubeButtonLink.querySelector('.Button-module_label__k1Dkf').style.cssText += 'color: white !important;';
        youtubeButtonLink.style.backgroundColor = '#2E2E2E';

        const songTitle = document.querySelector('.TrackPageHeader_title__wGI_Q')?.textContent;
        const artistName = document.querySelector('meta[itemprop="name"]')?.content;
        if (!songTitle || !artistName) return;

        const encodedSearch = encodeURIComponent(`${artistName} ${songTitle}`);

        youtubeButtonLink.href = `https://www.youtube.com/results?search_query=${encodedSearch}`;
        youtubeButtonLink.target = '_blank';

        shareButton.parentNode.insertBefore(youtubeButton, shareButton.nextSibling);
    };

    window.addEventListener('load', () => {
        addSpotifyButton();
        addYouTubeButton();
    });
})();
