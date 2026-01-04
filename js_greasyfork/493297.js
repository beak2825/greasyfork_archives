// ==UserScript==
// @name         SigningSavvy++
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Enhancements for SigningSavvy
// @author       daijro
// @license      MIT
// @match        https://www.signingsavvy.com/search/*
// @match        https://www.signingsavvy.com/sign/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=signingsavvy.com
// @require      https://update.greasyfork.org/scripts/395037/764968/MonkeyConfig%20Modern.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493297/SigningSavvy%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/493297/SigningSavvy%2B%2B.meta.js
// ==/UserScript==

/*
Tweaks for SigningSavvy:
- Automatically plays videos after searching
- Significantly increases video player load time
- Use 720p HD videos instead of 360p LD videos
- Removes ads from video player
- Optionally remove other bloat from the website through the config UI
*/

// Initialize MonkeyConfig
const config = new MonkeyConfig({
    title: 'Settings',
    menuCommand: true,
    params: {
        AUTOPLAY_VIDEO: {
            label: 'Autoplay videos after searching',
            type: 'checkbox',
            default: true
        },
        LOOP_VIDEO: {
            label: 'Loop video',
            type: 'checkbox',
            default: true
        },
        HD_VIDEO: {
            label: 'Higher quality videos',
            type: 'checkbox',
            default: true
        },
        REMOVE_ADS: {
            label: 'Remove left panel/ads',
            type: 'checkbox',
            default: true
        },
        REMOVE_HEADER: {
            label: 'Remove header',
            type: 'checkbox',
            default: false
        },
        REMOVE_DETAILS: {
            label: 'Remove details & footer',
            type: 'checkbox',
            default: false
        },
    },
    onSave: function() {
        window.location.reload();
    }
});
// Patch MonkeyConfig to prevent the settings window cutting off
GM.addStyle('#__MonkeyConfig_frame { width: 110% !important; }')

// Initialize config variables
const AUTOPLAY_VIDEO = config.get('AUTOPLAY_VIDEO');
const LOOP_VIDEO = config.get('LOOP_VIDEO');
const HD_VIDEO = config.get('HD_VIDEO');
const REMOVE_ADS = config.get('REMOVE_ADS');
const REMOVE_HEADER = config.get('REMOVE_HEADER');
const REMOVE_DETAILS = config.get('REMOVE_DETAILS');


function initializeNewPlayer(sourceUrl) {
    // Initialize a new video player
    const newVideoElement = document.createElement('video');
    newVideoElement.id = 'video-2';
    newVideoElement.className = 'video-js vjs-default-skin vjs-16-9 vjs-static-controls vjs-big-play-centered video-1-dimensions vjs-controls-enabled vjs-has-started vjs-user-inactive vjs-playing';
    newVideoElement.setAttribute('preload', 'auto');
    newVideoElement.setAttribute('width', '100%');
    newVideoElement.setAttribute('padding', '0px');
    newVideoElement.setAttribute('height', '100%');
    // Use high definition
    newVideoElement.src = HD_VIDEO ? sourceUrl.replace('mp4-ld', 'mp4-hd') : sourceUrl;

    const container = document.querySelector('.videocontent');
    if (!container) {
        console.error("Video container not found.");
        return
    }
    container.prepend(newVideoElement);
    videojs('video-2', {
        controls: true,
        loop: LOOP_VIDEO,
        muted: true,
        autoplay: AUTOPLAY_VIDEO,
        inactivityTimeout: 1,
        controlBar: {
            volumeMenuButton: false,
            remainingTimeDisplay: false
        }
    }).ready(function() {
        if (!AUTOPLAY_VIDEO) {
            return
        }
        this.play().catch(error => {
            console.error("Failed to start video on load:", error);
        });
    });
}

(function() {
    'use strict';

    // Remove ads
    if (REMOVE_ADS) {
        // Removes #main_content_right
        document.querySelector('#main_content_right').remove();
        // Removes tag .main_content_left
        document.querySelector('#main_content_left').id = '';
    }
    // Remove details & footer
    if (REMOVE_DETAILS) {
        document.querySelector('.signing_details').remove();
        document.querySelector('#footer').remove();
    }
    // Remove header
    if (REMOVE_HEADER) {
        // Make invisible
        document.querySelector('#header').style.display = 'none';
    }

    // Check for the existing video player and replace it
    const existingVideoElement = document.querySelector('video');
    if (!existingVideoElement) {
        console.error("Existing video element not found.");
        return
    }
    const sourceUrl = existingVideoElement.src;

    const player = videojs('video-1');
    if (!player) {
        console.error("Existing VideoJS player instance not found.");
        return
    }
    player.dispose();
    initializeNewPlayer(sourceUrl);
})();