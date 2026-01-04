// ==UserScript==
// @name         Play Single Video From YouTube Playlist
// @namespace    http://tampermonkey.net/
// @version      2025.08.07
// @description  Adds a button on YouTube playlist video (non-Shorts) entries, which links to a clean watch page for that video that does not include the playlist.
// @license      MIT
// @author       provigz (Vankata453)
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543921/Play%20Single%20Video%20From%20YouTube%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/543921/Play%20Single%20Video%20From%20YouTube%20Playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createPlaylistPlaySingleButtons() {
        if (location.href.indexOf("/playlist?") <= 0) return;

        const videoEntries = document.querySelectorAll("ytd-playlist-video-renderer");
        videoEntries.forEach((videoEntry) => {
            const videoEntryURLSplit = videoEntry.querySelector("a#thumbnail").getAttribute("href").split("&list=");
            if (videoEntryURLSplit.length <= 1) return; // The link to the video is clean by default, entry is a part of the "Recommended videos" section.

            const videoWatchURL = videoEntryURLSplit[0];

            let button = videoEntry.querySelector("button-view-model#button-play-single");
            if (button) {
                // Button exists, simply update the video URL
                button.querySelector("a").setAttribute("href", videoWatchURL);
                return;
            }

            button = document.createElement("button-view-model");
            button.className = "yt-spec-button-view-model";
            button.id = "button-play-single";

            const anchor = document.createElement("a");
            anchor.className = "yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment";
            anchor.setAttribute("aria-haspopup", "false");
            anchor.setAttribute("force-new-state", "true");
            anchor.setAttribute("aria-disabled", "false");
            anchor.setAttribute("href", videoWatchURL);
            anchor.setAttribute("aria-label", "Play Single");
            anchor.style.paddingRight = "0";

            const iconWrapper = document.createElement("div");
            iconWrapper.className = "yt-spec-button-shape-next__icon";
            iconWrapper.setAttribute("aria-hidden", "true");
            const icon = document.createElement("img");
            icon.setAttribute("src", "https://static.thenounproject.com/png/open-link-icon-1395731-512.png");
            icon.style.width = "24px";
            icon.style.height = "24px";
            iconWrapper.appendChild(icon);

            anchor.appendChild(iconWrapper);
            button.appendChild(anchor);

            videoEntry.insertBefore(button, videoEntry.querySelector("div#menu"));
        });
    }

    document.addEventListener("yt-navigate-finish", createPlaylistPlaySingleButtons);
    document.addEventListener("yt-action", (ev) => {
        if (event.detail && event.detail.actionName &&
            (event.detail.actionName.indexOf("yt-append-continuation") >= 0 ||
             event.detail.actionName == "yt-update-playlist-action")) {
            createPlaylistPlaySingleButtons();
        }
    });
})();