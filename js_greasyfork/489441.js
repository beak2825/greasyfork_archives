// ==UserScript==
// @name         Kick.com Enhancer
// @namespace    RishiSunak
// @version      0.3
// @description  Kick.com Chat Overlay & Auto Unmute/1080p
// @author       Rishi
// @match        https://kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489441/Kickcom%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/489441/Kickcom%20Enhancer.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let currentStreamSrc = '';
    let overlayContainer = null;
 
    function checkStreamChange() {
        const videoElement = document.querySelector('video.vjs-tech');
        if (videoElement) {
            const newStreamSrc = videoElement.getAttribute('src');
            if (newStreamSrc !== currentStreamSrc) {
                currentStreamSrc = newStreamSrc;
                if (overlayContainer) {
                    overlayContainer.remove();
                }
 
                setTimeout(() => {
                    customizeVideo();
                    const match = window.location.pathname.match(/^\/(.+)$/);
                    if (match) {
                        const streamerName = match[1];
                        createOverlay(streamerName);
                    }
                }, 2000); 
            }
        }
    }
 
    function customizeVideo() {
        const muteControlButton = document.querySelector('.vjs-mute-control');
        if (muteControlButton) {
            const buttonText = muteControlButton.querySelector('.vjs-control-text').textContent.trim().toLowerCase();
 
            if (buttonText === 'unmute') {
                simulateClick(muteControlButton);
            }
        }
 
        // Set video quality to 1080p if available
        const qualityButtons = document.querySelectorAll('.vjs-menu-item-text');
        qualityButtons.forEach(button => {
            if (button.textContent.trim().toLowerCase() === '1080p60') {
                simulateClick(button);
            }
        });
 
        console.log('Video customized');
    }
 
    function createOverlay(streamerName) {
        const videoElement = document.getElementById('mifu-player-check');
        if (!videoElement) {
            return;
        }
 
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.bottom = '32px';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '40vh';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'none';
 
        const iframe = document.createElement('iframe');
        iframe.src = `https://cxwatcher.github.io/chat?user=${streamerName}&animate=true&badges=true&commands=true&bots=true&textsize=15px`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
 
        overlay.appendChild(iframe);
        videoElement.parentNode.appendChild(overlay);
 
        console.log('Overlay created');
        overlayContainer = document.getElementById('overlay-container');
    }
 
    function simulateClick(element) {
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }
 
    setTimeout(() => {
        checkStreamChange();
 
        setInterval(() => {
            checkStreamChange();
        }, 500);
    }, 2000);
})();
