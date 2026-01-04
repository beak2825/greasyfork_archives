// ==UserScript==
// @name         爱壹帆IYF网页全屏(国际版)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Toggle the video container between normal and maximized view with a button and the "M" key shortcut. The button has enhanced styling.
// @match        https://www.yfsp.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531073/%E7%88%B1%E5%A3%B9%E5%B8%86IYF%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%28%E5%9B%BD%E9%99%85%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531073/%E7%88%B1%E5%A3%B9%E5%B8%86IYF%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%28%E5%9B%BD%E9%99%85%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container, toggleButton;
    let maximized = false;
    let originalStyles = {};

    function waitForVideo() {
        // Target the video element by its id.
        const video = document.querySelector('video#video_player');
        if (video) {
            console.log("Video found!");
            initialize(video);
        } else {
            console.log("Waiting for video element...");
            setTimeout(waitForVideo, 1000);
        }
    }

    function initialize(video) {
        // Use closest() to find the <vg-player> container.
        container = video.closest('vg-player');
        if (!container) {
            container = video.parentElement;
        }
        console.log("Container found:", container);
        addToggleButton();
        addKeyboardShortcut();
    }

    function addToggleButton() {
        toggleButton = document.createElement('button');
        toggleButton.innerHTML = 'Toggle Maximize';
        // Enhanced styling: bold border and transparent filling.
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '20px';
        toggleButton.style.right = '20px';
        toggleButton.style.zIndex = '10000';
        toggleButton.style.padding = '8px 12px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.border = '2px solid white';
        toggleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        toggleButton.style.color = 'white';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener('click', toggleMaximize);
    }

    function addKeyboardShortcut() {
        document.addEventListener('keydown', function(e) {
            // Toggle when pressing 'M' (ignore if typing in an input field)
            if (e.target.tagName.toLowerCase() !== 'input' && e.key.toLowerCase() === 'm') {
                toggleMaximize();
            }
        });
    }

    function toggleMaximize() {
        if (!maximized) {
            // Save current inline styles.
            originalStyles = {
                position: container.style.position,
                top: container.style.top,
                left: container.style.left,
                width: container.style.width,
                height: container.style.height,
                zIndex: container.style.zIndex
            };
            // Maximize the container.
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.zIndex = '9999';
            document.body.style.overflow = 'hidden';
            toggleButton.innerHTML = 'Restore';
            maximized = true;
            console.log("Container maximized.");
        } else {
            // Restore original styles.
            container.style.position = originalStyles.position;
            container.style.top = originalStyles.top;
            container.style.left = originalStyles.left;
            container.style.width = originalStyles.width;
            container.style.height = originalStyles.height;
            container.style.zIndex = originalStyles.zIndex;
            document.body.style.overflow = '';
            toggleButton.innerHTML = 'Toggle Maximize';
            maximized = false;
            console.log("Container restored.");
        }
    }

    waitForVideo();
})();