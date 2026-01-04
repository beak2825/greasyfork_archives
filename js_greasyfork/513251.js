// ==UserScript==
// @name         Gelbooru Size Video in View
// @namespace    https://greasyfork.org/en/users/460331-xerodusk
// @version      3.1.0
// @description  Keeps video player where it always looks good, even without scrolling.
// @author       Xerodusk
// @homepage     https://greasyfork.org/en/users/460331-xerodusk
// @license      GPL-3.0-or-later
// @match        https://gelbooru.com/index.php?page=post&s=view*
// @grant        none
// @icon         https://gelbooru.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/513251/Gelbooru%20Size%20Video%20in%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/513251/Gelbooru%20Size%20Video%20in%20View.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    // Get current video elements
    const video = document.getElementById('gelcomVideoPlayer');
    if (!video) {
        return;
    }
    const webm = video.querySelector('[type="video/webm"]');
    const mp4 = video.querySelector('[type="video/mp4"]');

    // Create replacement video element
    // Necessary to detach terrible breaking scripts present on the original player
    const newVideo = document.createElement('video');
    newVideo.id = 'newGelcomVideoPlayer';
    newVideo.controls = 'controls';
    newVideo.flashstopped = 'true';
    newVideo.name = 'media';
    newVideo.loop = 'loop';
    newVideo.preload = 'metadata';

    // Copy over attributes from current video element
    newVideo.width = video.width;
    newVideo.height = video.height;
    newVideo.poster = video.poster;
    newVideo.appendChild(webm);
    newVideo.appendChild(mp4);

    // Get distance from top of page to video
    const distanceToTopVideo = window.pageYOffset + video.getBoundingClientRect().top;
    // Get distance from bottom of video to under links
    const underLinks = document.getElementById('scrollebox');
    const distanceToTopLinks = underLinks.getBoundingClientRect().top - video.getBoundingClientRect().bottom;
    // Get height of under links
    const distanceToBottomLinks = underLinks.offsetHeight;
    const paddingToLeave = distanceToTopVideo + (distanceToTopLinks * 2) + distanceToBottomLinks;

    // Apply styling to fix size
    const css = document.createElement('style');
    css.appendChild(document.createTextNode(`
        #newGelcomVideoPlayer {
            width: auto !important;
            height: auto !important;
            max-width: min(100%, 1272px) !important;
            max-height: calc(100vh - ${paddingToLeave}px) !important;
        }
    `));
    document.head.appendChild(css);

    // Replace video element
    video.before(newVideo);
    video.remove();
})();