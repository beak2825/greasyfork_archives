// ==UserScript==
// @name         Audio Tab Title
// @description  Change the window title on YouTube based on the channel name and video title, and append the website name on Spotify and SoundCloud pages.
// @version      0.6.6
// @namespace    itsafeature.org
// @author       Geoffrey De Belie (Smile4ever)
// @license      Unlicense
// @match        https://www.youtube.com/watch?v=*
// @match        https://music.youtube.com/*
// @match        https://open.spotify.com/*
// @match        https://soundcloud.com/*
// @match        https://music.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525581/Audio%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/525581/Audio%20Tab%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Format GrupoBryndisOficial to Grupo Bryndis
    function formatChannelName(name) {
        if (!name.includes(" ")) {
            name = name.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add spaces if none exist
        }
        return name.replace("Oficial", "").trim(); // Remove "Oficial" and trim spaces
    }

    // Function to update the title on YouTube
    function updateYouTubeTitle() {
        const metadataElementArtist = document.querySelector(".yt-video-attribute-view-model__metadata h4"); // Artist
        const metadataElementArtistText = metadataElementArtist?.innerText ?? "";
        const metadataElementTitle = document.querySelector(".yt-video-attribute-view-model__metadata h1"); // Title
        const metadataElementTitleText = metadataElementTitle?.innerText ?? "";

        const channelElement = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string');
        const channelName = channelElement?.innerText ?? "";
        const channelNameClean = formatChannelName(channelName.split(' - ')[0].split('|')[0]);

        const videoTitleElement = document.querySelector('#above-the-fold #title');
        let videoTitle = videoTitleElement?.innerText ?? "";
        const spaceIndex = videoTitle.indexOf(' ');
        const dashIndex = videoTitle.indexOf('-');
        const spaceDashIndex = videoTitle.indexOf(' - ');
        const lastDashIndex = videoTitle.lastIndexOf('-');

        // Cleanup videoTitle
        videoTitle = videoTitle.replace(" - Video Oficial", "");
        videoTitle = videoTitle.replace(" - Video", "");

        // We need the video title element, if it's not found the page structure must have changed
        if(videoTitleElement == null) return;

        if (metadataElementArtist && metadataElementTitle && lastDashIndex != -1){
            const contentAfterDash = videoTitle.substring(lastDashIndex + 1).trim();

            if (contentAfterDash.toLowerCase().includes(metadataElementArtistText.toLowerCase())) {
                // If metadata artist appears after the dash in video title, fix the tab title
                document.title = `${metadataElementArtistText} - ${metadataElementTitleText} - YouTube`;
                return;
            }
        }

        // Fix dash, for example Marco Antonio Solís — Eran Mentiras
        if(dashIndex == -1 && videoTitle.indexOf("—") != -1){
            document.title = `${videoTitle.replace("—", "-")} - YouTube`;
            return;
        }

        // Fix comma's, for example Marco Antonio Solís, Los Bukis - Será Mejor Que Te Vayas
        // But don't break Olvídala, Binomio De Oro De América - Video Oficial
        if(spaceDashIndex != -1 && videoTitle.indexOf(", ") != -1 && metadataElementArtistText.indexOf(", ") != -1){
            document.title = `${videoTitle.split(", ")[0]} - ${videoTitle.split(" - ")[1]} - YouTube`;
            return;
        }

        // Use metadata if available, but not if the artist and title are the same
        if (metadataElementArtist && metadataElementTitle && metadataElementArtistText != metadataElementTitleText && metadataElementArtistText.includes("|") == false) {
            // Set the window title for YouTube if needed
            document.title = `${metadataElementArtistText} - ${metadataElementTitleText} - YouTube`;
            return;
        }

        // Sombras, Los Betas - Video
        if(videoTitle.indexOf("-") == -1 && videoTitle.indexOf(", ") != -1){
            document.title = videoTitle.replace(", ", " - ") + " - YouTube";
            return;
        }

        // Fall back to channel + video title approach
        if (channelElement && videoTitle.includes('-') == false) {
            // If there's no space, continue. If the first dash appears before the first space, get out (case A-ha)
            if (spaceIndex != -1 && dashIndex < spaceIndex) return;

            // Set the window title for YouTube if needed
            if(videoTitle.includes(channelNameClean) == false){
                document.title = `${channelNameClean} - ${videoTitle} - YouTube`;
                return;
            }
        }
    }

    // Function to update the title on YouTube Music
    function updateYouTubeMusicTitle() {
        const elements = document.querySelectorAll('.ytmusic-player-bar yt-formatted-string');
        if (elements.length < 2) return;

        const artistElement = elements[1];
        const audioTitleElement = elements[0];

        if (artistElement && audioTitleElement) {
            const artistName = artistElement.childNodes[0].innerText;
            const audioTitle = audioTitleElement.innerText;

            // Set the window title for YouTube Music
            document.title = `${artistName} - ${audioTitle} - YouTube Music`;
        }
    }

    // Function to update the title on Spotify
    function updateSpotifyTitle() {
        const titleElement = document.querySelector('title'); // Get the <title> element
        if (titleElement.innerText.includes(" - Spotify") == false) {
            titleElement.innerText = `${titleElement.innerText} - Spotify`; // Set the title's innerText for Spotify
        }
    }

     function updateSoundCloudTitle() {
        const titleElement = document.querySelector('title'); // Get the <title> element
        if (titleElement.innerText.includes(" - SoundCloud") == false) {
            titleElement.innerText = `${titleElement.innerText} - SoundCloud`; // Set the title's innerText for Spotify
        }
    }

    function updateAmazonMusicTitle(){
        const shadowHost = document.querySelector('music-horizontal-item');
        const shadowRoot = shadowHost.shadowRoot;
        const musicLinks = shadowRoot.querySelectorAll('music-link');

        if (musicLinks.length >= 2) {
            const songTitle = musicLinks[0].getAttribute('title');
            const artistTitle = musicLinks[1].getAttribute('title');

            document.title = `${artistTitle} - ${songTitle} - Amazon Music`;
        }
    }

    // Function to check for the current platform
    function updateTitle() {
        if (window.location.hostname == 'music.youtube.com'){
            updateYouTubeMusicTitle();
        } else if (window.location.hostname.includes('youtube.com')) {
            updateYouTubeTitle();
        } else if (window.location.hostname.includes('spotify.com')) {
            updateSpotifyTitle();
        } else if (window.location.hostname.includes('soundcloud.com')) {
            updateSoundCloudTitle();
        } else if (window.location.hostname.includes('music.amazon.com')) {
            updateAmazonMusicTitle();
        }
    }

    // Optionally, observe changes in the page if the title might update after load
    const observer = new MutationObserver(updateTitle);
    observer.observe(document.body, { childList: true, subtree: true });

    // Wait for the page content to load before running the updateTitle function
    window.addEventListener('load', updateTitle);

    // Set an interval to check the title every second on Spotify pages only
    setInterval(() => {
        updateTitle(); // Update the title every X seconds (if needed)
    }, 2000);
})();
