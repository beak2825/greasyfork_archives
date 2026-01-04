// ==UserScript==
// @name         Auto-hide video controls almost instantly / really quickly for the Twitch desktop and mobile site
// @author       NWP
// @description  Auto-hides video controls for the Twitch desktop and mobile site after half a second (500 ms) of mouse inactivity over the video player area. Unhide the controls as you would usually do on Twitch.
// @namespace    https://greasyfork.org/users/877912
// @version      0.2
// @license      MIT
// @match        *://*.twitch.tv/*
// @match        *://m.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501592/Auto-hide%20video%20controls%20almost%20instantly%20%20really%20quickly%20for%20the%20Twitch%20desktop%20and%20mobile%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/501592/Auto-hide%20video%20controls%20almost%20instantly%20%20really%20quickly%20for%20the%20Twitch%20desktop%20and%20mobile%20site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const idleTime = 500;
    let idleTimeoutRegular, idleTimeoutMobile, cursorTimeout;
    let currentUrl = window.location.href;

    function hideElementsRegular() {
        const overlay = document.querySelector(".video-player__overlay");
        const extraElement = document.querySelector(".kLMGYG .ejeLlX");
        if (overlay) overlay.style.display = 'none';
        if (extraElement) extraElement.style.display = 'none';
    }

    function showElementsRegular() {
        const overlay = document.querySelector(".video-player__overlay");
        const extraElement = document.querySelector(".kLMGYG .ejeLlX");
        if (overlay) overlay.style.display = '';
        if (extraElement) extraElement.style.display = '';
    }

    function hideElementsMobile() {
        const overlay = document.querySelector(".video-player__overlay");
        if (overlay) overlay.style.display = 'none';
    }

    function showElementsMobile() {
        const overlay = document.querySelector(".video-player__overlay");
        if (overlay) overlay.style.display = '';
    }

    function hideCursor() {
        document.querySelector(".video-player__container").style.cursor = 'none';
    }

    function showCursor() {
        document.querySelector(".video-player__container").style.cursor = '';
    }

    function onMouseMoveRegular() {
        clearTimeout(idleTimeoutRegular);
        clearTimeout(cursorTimeout);
        showElementsRegular();
        showCursor();
        idleTimeoutRegular = setTimeout(hideElementsRegular, idleTime);
        const videoPlayer = document.querySelector(".video-player__container");
        if (videoPlayer && videoPlayer.matches(':hover')) {
            cursorTimeout = setTimeout(hideCursor, idleTime);
        }
    }

    function onMouseMoveMobile() {
        clearTimeout(idleTimeoutMobile);
        clearTimeout(cursorTimeout);
        showElementsMobile();
        showCursor();
        idleTimeoutMobile = setTimeout(hideElementsMobile, idleTime);
        const videoPlayer = document.querySelector(".video-player__container");
        if (videoPlayer && videoPlayer.matches(':hover')) {
            cursorTimeout = setTimeout(hideCursor, idleTime);
        }
    }

    function onMouseEnterMobile() {
        showElementsMobile();
    }

    function onMouseLeaveMobile() {
        hideElementsMobile();
    }

    function sendKeyPress(key) {
        const event = new KeyboardEvent('keydown', {
            key: key,
            keyCode: key === 'F' ? 70 : key === 'Escape' ? 27 : key === 'T' ? 84 : 0, // 'F' = 70, 'ESC' = 27, 'T' = 84
            bubbles: true,
            altKey: key === 'T' // alt + T for theatre mode
        });
        document.dispatchEvent(event);
    }

    function handleFullscreenToggle() {
        const isFullscreen = document.fullscreenElement != null;
        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            const videoPlayer = document.querySelector(".video-player__container");
            if (videoPlayer) {
                videoPlayer.requestFullscreen();
            }
        }
    }

    function handleTheatreModeToggle() {
        sendKeyPress('T');
    }

    function onDoubleClickRegular() {
        const isTheatreMode = document.querySelector("div[data-a-target='root-scroller']").classList.contains("theatre");
        if (document.fullscreenElement) {
            document.exitFullscreen();
            if (isTheatreMode) {
                sendKeyPress('T');
            }
        } else if (isTheatreMode) {
            handleFullscreenToggle();
        } else {
            handleFullscreenToggle();
        }
    }

    function onDoubleClickMobile() {
        sendKeyPress('F');
    }

    function onFullscreenButtonClick() {
        handleFullscreenToggle();
    }

    function onTheatreModeButtonClick() {
        handleTheatreModeToggle();
    }

    function setupMouseListener() {
        const regularTwitch = document.querySelector("div[data-a-player-state='']");
        if (regularTwitch) {
            regularTwitch.addEventListener('mousemove', onMouseMoveRegular);
            regularTwitch.addEventListener('dblclick', onDoubleClickRegular);
            onMouseMoveRegular();
        }

        const mobileTwitch = document.querySelector("div[data-a-target='video-player']");
        if (mobileTwitch) {
            mobileTwitch.addEventListener('mousemove', onMouseMoveMobile);
            mobileTwitch.addEventListener('mouseenter', onMouseEnterMobile);
            mobileTwitch.addEventListener('mouseleave', onMouseLeaveMobile);
            mobileTwitch.addEventListener('dblclick', onDoubleClickMobile);
            onMouseMoveMobile();
        }

        const fullscreenButton = document.querySelector("button[aria-label*='Fullscreen']");
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', onFullscreenButtonClick);
        }

        const theatreModeButton = document.querySelector("button[aria-label*='Theatre Mode']");
        if (theatreModeButton) {
            theatreModeButton.addEventListener('click', onTheatreModeButtonClick);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'f' || event.key === 'Escape') {
                handleFullscreenToggle();
            }
            if (event.altKey && event.key === 't') {
                handleTheatreModeToggle();
            }
        });
    }

    function checkUrlChange() {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            setupMouseListener();
        }
    }

    const observer = new MutationObserver(checkUrlChange);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(setupMouseListener, 1000);
    });

    setupMouseListener();
})();