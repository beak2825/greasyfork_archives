// ==UserScript==
// @name         Stop video 12 seconds before the end for Secular Talk videos to avoid the ad at the end
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Stop video 12 seconds before the end for Secular Talk videos on YouTube
// @author       Your name
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465879/Stop%20video%2012%20seconds%20before%20the%20end%20for%20Secular%20Talk%20videos%20to%20avoid%20the%20ad%20at%20the%20end.user.js
// @updateURL https://update.greasyfork.org/scripts/465879/Stop%20video%2012%20seconds%20before%20the%20end%20for%20Secular%20Talk%20videos%20to%20avoid%20the%20ad%20at%20the%20end.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // define the username of the channel you want to target
    const targetChannel = 'Secular Talk';
    const targetVideoDuration = 12; // Stop the video 12 seconds before the end

    console.log('Script loaded');

    // check if the video is from the target channel
    function isTargetVideo() {
        const channelNameElement = document.querySelector('.ytd-channel-name a');
        if (channelNameElement) {
            const channelName = channelNameElement.textContent.trim();
            return channelName === targetChannel;
        }
        return false;
    }

    let video = null;
    let videoDuration = 0;

    function init() {
        setInterval(checkVideo, 500);
    }

    function checkVideo() {
        video = document.querySelector('video.html5-main-video');
        if (video) {
            if (!video.paused && isTargetVideo()) {
                videoDuration = video.duration;
                if (videoDuration - video.currentTime <= targetVideoDuration) {
                    console.log('Stopping video');
                    video.pause();
                }
            }
        }
    }

    init();
})();
