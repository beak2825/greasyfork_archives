// ==UserScript==
// @name         Plex Ambilight
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds an ambient light effect to the Plex web player to prevent OLED burn-in and enhance immersion.
// @author       Rick Khakis
// @match        https://app.plex.tv/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547090/Plex%20Ambilight.user.js
// @updateURL https://update.greasyfork.org/scripts/547090/Plex%20Ambilight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = {
        blur: 75,
        scale: 1.2,
        opacity: 1,
    };

    let videoElement = null;
    let canvasElement = null;
    let blackoutElement = null;
    let animationFrameId = null;

    function draw() {
        if (videoElement && !videoElement.paused && !videoElement.ended && canvasElement) {
            try {
                const context = canvasElement.getContext('2d');
                context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            } catch (error) {
                console.error('Plex Ambilight: Draw error.', error);
                stopAnimation();
            }
        }
        if (animationFrameId !== null) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }

    const stopAnimation = () => {
         if (animationFrameId) {
             cancelAnimationFrame(animationFrameId);
             animationFrameId = null;
         }
    };

    function cleanup() {
        console.log('Plex Ambilight: Cleaning up canvas and listeners.');
        stopAnimation();
        if (canvasElement) {
            canvasElement.remove();
            canvasElement = null;
        }
        if (blackoutElement) {
            blackoutElement.remove();
            blackoutElement = null;
        }
        videoElement = null;
    }

    function setupAmbilight(video) {
        if (videoElement === video) return;

        console.log('Plex Ambilight: Video element found. Setting up canvas.', video);
        videoElement = video;

        const playerContainer = video.closest('.Player-fullPlayerContainer-wBDz23');
        if (!playerContainer) { return; }

        const insertionPoint = playerContainer.parentElement;
        if (!insertionPoint) { return; }

        video.style.backgroundColor = 'transparent';
        playerContainer.style.backgroundColor = 'transparent';

        blackoutElement = document.createElement('div');
        blackoutElement.classList.add('ambilight-blackout-layer');
        blackoutElement.style.position = 'fixed';
        blackoutElement.style.top = '0';
        blackoutElement.style.left = '0';
        blackoutElement.style.width = '100vw';
        blackoutElement.style.height = '100vh';
        blackoutElement.style.backgroundColor = '#000';
        blackoutElement.style.zIndex = '1011';
        document.body.appendChild(blackoutElement);

        canvasElement = document.createElement('canvas');
        canvasElement.classList.add('ambilight-canvas');
        canvasElement.style.position = 'absolute';
        canvasElement.style.top = '-5%';
        canvasElement.style.left = '-5%';
        canvasElement.style.width = '110%';
        canvasElement.style.height = '110%';
        canvasElement.style.zIndex = '1012';
        canvasElement.style.filter = `blur(${settings.blur}px)`;
        canvasElement.style.transform = `scale(${settings.scale})`;
        canvasElement.style.opacity = `${settings.opacity}`;
        canvasElement.style.mixBlendMode = 'screen';

        insertionPoint.prepend(canvasElement);

        video.addEventListener('play', () => {
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(draw);
            }
        });

        video.addEventListener('pause', stopAnimation);
        video.addEventListener('ended', stopAnimation);
    }

    console.log('Plex Ambilight: Script loaded. Watching for video player...');

    const observer = new MutationObserver((mutations) => {
        const videoSelector = 'video.HTMLMedia-mediaElement-u17S9P';
        const videoNode = document.querySelector(videoSelector);

        if (videoNode) {
            setupAmbilight(videoNode);
        } else if (videoElement) {
            cleanup();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();