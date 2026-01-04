// ==UserScript==
// @name         Social Media Background Playback
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keeps videos playing in the background on Google, TikTok, & Instagram
// @author       UniverseDev
// @icon         https://i.postimg.cc/nhtdDdSF/DALL-E-2025-02-03-08-50-33-A-sleek-and-modern-icon-representing-background-video-playback-The-ico.webp
// @license      GPL-3.0-or-later
// @match        https://www.google.com/search?*
// @match        https://www.tiktok.com/*
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525769/Social%20Media%20Background%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/525769/Social%20Media%20Background%20Playback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function overrideVisibility() {
        Object.defineProperties(document, {
            hidden: {
                configurable: true,
                get: () => false
            },
            visibilityState: {
                configurable: true,
                get: () => 'visible'
            }
        });
        document.dispatchEvent(new Event('visibilitychange'));
        console.log("Visibility override activated");
    }

    function restoreVisibility() {
        try {
            delete document.hidden;
            delete document.visibilityState;
            console.log("Visibility override deactivated");
        } catch (e) {
            console.error("Error restoring visibility:", e);
        }
    }

    function googleVideoPlayback() {
        function keepPageVisible() {
            let hiddenProp;
            if (typeof document.hidden !== "undefined") {
                hiddenProp = "hidden";
            } else if (typeof document.msHidden !== "undefined") {
                hiddenProp = "msHidden";
            } else if (typeof document.webkitHidden !== "undefined") {
                hiddenProp = "webkitHidden";
            } else {
                console.warn('Google: Visibility API not supported');
                return;
            }
            try {
                Object.defineProperty(document, hiddenProp, {
                    get: () => false,
                    configurable: true
                });
                Object.defineProperty(document, 'visibilityState', {
                    get: () => 'visible',
                    configurable: true
                });
                console.log('Google: Page visibility override applied');
            } catch (error) {
                console.error('Google: Failed to override visibility', error);
            }
        }

        function checkAndActivateForVideo() {
            const videoElements = document.querySelectorAll('video');
            if (videoElements.length > 0) {
                keepPageVisible();
            }
        }

        function checkAndActivateVisibilityOverride() {
            const fragment = window.location.hash;
            if (fragment.includes('vid:')) {
                keepPageVisible();
            } else {
                console.log('Google: Not a video page based on URL fragment.');
            }
        }

        setInterval(checkAndActivateForVideo, 2000);
        window.addEventListener('load', () => {
            checkAndActivateForVideo();
            checkAndActivateVisibilityOverride();
        });

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            checkAndActivateForVideo();
            checkAndActivateVisibilityOverride();
        };
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            checkAndActivateForVideo();
            checkAndActivateVisibilityOverride();
        };

        checkAndActivateForVideo();
        checkAndActivateVisibilityOverride();
    }

    function socialVideoPlayback(platform) {
        let isOverrideActive = false;
        let isVideoPlaying = false;
        let currentVideoElement = null;

        function activateOverride() {
            if (!isOverrideActive) {
                overrideVisibility();
                isOverrideActive = true;
                console.log(platform + ": Background Playback Activated");
            }
        }

        function deactivateOverride() {
            if (isOverrideActive) {
                restoreVisibility();
                isOverrideActive = false;
                console.log(platform + ": Background Playback Deactivated");
            }
        }

        document.addEventListener('play', function(event) {
            if (event.target.tagName === 'VIDEO') {
                isVideoPlaying = true;
                currentVideoElement = event.target;
                console.log(platform + ": Video started.");
                if (document.hidden) {
                    activateOverride();
                }
            }
        }, true);

        document.addEventListener('ended', function(event) {
            if (event.target.tagName === 'VIDEO' && event.target === currentVideoElement) {
                isVideoPlaying = false;
                currentVideoElement = null;
                if (!document.hidden) {
                    deactivateOverride();
                }
                console.log(platform + ": Video ended.");
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && isVideoPlaying) {
                activateOverride();
            } else if (!document.hidden && isOverrideActive) {
                deactivateOverride();
            }
        });
    }

    const hostname = window.location.hostname;
    if (hostname.includes("google.com")) {
        googleVideoPlayback();
    } else if (hostname.includes("tiktok.com")) {
        socialVideoPlayback("TikTok");
    } else if (hostname.includes("instagram.com")) {
        socialVideoPlayback("IG");
    }
})();
