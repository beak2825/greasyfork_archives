// ==UserScript==
// @name        Instagram Auto Unmute Videos and Stories
// @namespace   your_namespace
// @match       https://www.instagram.com/*
// @grant       none
// @version     1.0
// @author      UniverDev
// @license     GPL-3.0-or-later
// @icon        https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @description Automatically unmutes Instagram videos and stories once per session or event.
// @downloadURL https://update.greasyfork.org/scripts/523393/Instagram%20Auto%20Unmute%20Videos%20and%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/523393/Instagram%20Auto%20Unmute%20Videos%20and%20Stories.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let videoUnmuted = false;
    let storyUnmuted = false;

    function clickUnmuteButton(selector, flagSetter) {
        console.log(`Looking for button with selector: ${selector}`);
        const button = document.querySelector(selector);
        if (button) {
            console.log(`Found button. Clicking to unmute.`);
            button.click();
            flagSetter(true);
        } else {
            console.log(`Button not found for selector: ${selector}`);
        }
    }

    const handleVideoPlay = (event) => {
        if (event.target.tagName === 'VIDEO' && !videoUnmuted) {
            console.log('Video play event detected. Checking unmute status.');
            clickUnmuteButton('button[aria-label="Toggle audio"]', (value) => {
                videoUnmuted = value;
                console.log(`Video unmuted: ${videoUnmuted}`);
            });
            monitorMuteStateOnce(event.target, 'button[aria-label="Toggle audio"]', () => {
                videoUnmuted = true;
                console.log('Video unmuted after monitoring mute state.');
            });
        }
    };

    const handleStoryPlay = (event) => {
        if (event.target.tagName === 'VIDEO' && !storyUnmuted) {
            console.log('Story play event detected. Checking unmute status.');
            clickUnmuteButton('div[aria-label="Toggle audio"][role="button"]', (value) => {
                storyUnmuted = value;
                console.log(`Story unmuted: ${storyUnmuted}`);
            });
            monitorMuteStateOnce(event.target, 'div[aria-label="Toggle audio"][role="button"]', () => {
                storyUnmuted = true;
                console.log('Story unmuted after monitoring mute state.');
            });
        }
    };

    const monitorMuteStateOnce = (videoElement, selector, callback) => {
        const onVolumeChange = () => {
            if (videoElement.muted) {
                console.log('Video is muted. Attempting to unmute.');
                clickUnmuteButton(selector, () => {
                    callback();
                });
            } else {
                console.log('Video is not muted. Removing mute state listener.');
                videoElement.removeEventListener('volumechange', onVolumeChange);
            }
        };
        videoElement.addEventListener('volumechange', onVolumeChange);
    };

    const resetUnmuteFlags = () => {
        console.log('Resetting unmute flags.');
        videoUnmuted = false;
        storyUnmuted = false;
    };

    const monitorSplashScreen = () => {
        console.log('Monitoring splash screen for visibility changes.');
        const splashScreen = document.querySelector('[data-testid="splashScreen"]');
        if (splashScreen) {
            splashScreen.addEventListener('transitionend', () => {
                if (window.getComputedStyle(splashScreen).display !== 'none') {
                    console.log('Splash screen visible. Resetting unmute flags.');
                    resetUnmuteFlags();
                }
            });
        } else {
            console.log('Splash screen not found.');
        }
    };

    const initialize = () => {
        console.log('Initializing script.');
        document.addEventListener('play', (event) => {
            if (event.target.tagName === 'VIDEO') {
                handleVideoPlay(event);
                handleStoryPlay(event);
            }
        }, true);

        monitorSplashScreen();
    };

    window.addEventListener('load', initialize);
})();
