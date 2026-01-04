// ==UserScript==
// @name            Cleanup YouTube Recommendations in Search and Playlist
// @name:de         Bereinige YouTube Empfehlungen in der Suche und bei Playlisten
// @version         1.1.8
// @description     Deletes "People also watched", "For you", "Previously watched", "From related searches", "Latest from", "Popular videos from today", "New channels for you", "People also search for", "Shorts", "Latest Shorts from", "Recommended playlists" and "Recommended videos" Sections from Search Results, Playlists and Channels on YouTube
// @description:de  Entfernt die Abschnitte "Nutzer haben auch gesehen", "Für mich", "Schon angesehen", "Aus ähnlichen Suchanfragen", "Neueste Videos von", "Beliebte Videos von heute", "Neue Kanäle für dich", "Ähnliche Suchanfragen", "Shorts", "Neueste Shorts von", "Empfohlene Playlists" und "Empfohlene Videos" aus den Suchergebnissen, Playlisten und Kanälen auf YouTube
// @icon            https://www.google.com/s2/favicons?domain=youtube.com
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/cleanup-youtube-recommendations-search-playlist
// @license         MIT
// @match           https://www.youtube.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/436569/Cleanup%20YouTube%20Recommendations%20in%20Search%20and%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/436569/Cleanup%20YouTube%20Recommendations%20in%20Search%20and%20Playlist.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function cleanup() {
        if (window.location.href.startsWith("https://www.youtube.com/playlist")) {
            document.querySelector('ytd-item-section-renderer[is-playlist-video-container]')?.remove(); // Recommended videos
            document.querySelector('ytd-item-section-renderer[is-playlist-shelf]')?.remove(); // Recommended playlists
            document.querySelector('ytd-item-section-renderer:has(ytd-shelf-renderer)[page-subtype=playlist]')?.remove(); // Recommended playlists
            document.querySelector('ytd-continuation-item-renderer:nth-child(2)')?.remove(); // Loading circle
        }

        if (window.location.href.startsWith("https://www.youtube.com/results")) {
            [...document.querySelectorAll("ytd-shelf-renderer")].forEach(item => item.remove()); // Sections: People also watched, For you, Previously watched, From related searches, Latest from, Popular videos from today, New channels for you
            [...document.querySelectorAll("ytd-horizontal-card-list-renderer")].forEach(item => item.remove()); // Section: People also search for
            [...document.querySelectorAll("ytd-reel-shelf-renderer")].forEach(item => item.remove()); // [Legacy] Sections: Shorts, Latest Shorts from
            [...document.querySelectorAll("grid-shelf-view-model")].forEach(item => item.remove()); // Sections: Shorts, Latest Shorts from
        }

        if (window.location.href.startsWith("https://www.youtube.com/@") && (!window.location.pathname.substr(2).includes("/") || window.location.pathname.endsWith("/featured"))) {
            [...document.querySelectorAll("ytd-item-section-renderer")].filter(item => item.querySelector('yt-horizontal-list-renderer:not([grid-video-width="0"])'))[0]?.remove(); // For you
        }
    }

    setInterval(cleanup, 500);
    cleanup();
})();
