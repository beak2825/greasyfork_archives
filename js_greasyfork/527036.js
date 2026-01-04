// ==UserScript==
// @name                YouTube Preview Unmute
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_preview_unmute_namespace
// @version             1.0.7
// @match               *://www.youtube.com/*
// @noframes
// @run-at              document-start
// @license             MIT
// @description         This script automatically unmutes the video previews on the YouTube homepage when you hover over them.
// @downloadURL https://update.greasyfork.org/scripts/527036/YouTube%20Preview%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/527036/YouTube%20Preview%20Unmute.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
    'use strict';

    let pageType = '';

    function unmuteVideo(event) {
        if (pageType !== 'browse' && pageType !== 'search') return;
        try {
            const ytVolumeSetting = JSON.parse(JSON.parse(localStorage.getItem('yt-player-volume'))?.data ?? '{}');
            if (ytVolumeSetting?.muted !== true && event.target.id === 'inline-player') {
                event.target?.player_?.unMute();
            }
        } catch (error) {
            throw ('Failed to unmute video due to this error. Error: ', error);
        }
    }

    window.addEventListener(
        'yt-page-data-fetched',
        (event) => {
            pageType = event.detail?.pageData?.page;
        },
        true,
    );
    window.addEventListener(
        'yt-player-updated',
        (event) => {
            unmuteVideo(event);
        },
        true,
    );
})();
