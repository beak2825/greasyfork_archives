// ==UserScript==
// @name         YouTube iFrame AdBlocker
// @namespace    Booth-Stash
// @license      MIT
// @version      1.0
// @description  Bypass YouTube's ad-blocker detection by dynamically replacing the video player with an iframe.
// @author       ils94
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477909/YouTube%20iFrame%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/477909/YouTube%20iFrame%20AdBlocker.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Utility functions
    function getAutoplayState() {
        return localStorage.getItem('autoplayNext') === 'true';
    }
 
    function setAutoplayState(state) {
        localStorage.setItem('autoplayNext', state.toString());
    }
 
    function toggleAutoplayState(button) {
        const autoplayNext = !getAutoplayState();
        setAutoplayState(autoplayNext);
        button.title = autoplayNext ? 'Autoplay is on' : 'Autoplay is off';
        button.setAttribute('aria-label', autoplayNext ? 'Autoplay is on' : 'Autoplay is off');
        button.querySelector('.ytp-autonav-toggle-button').setAttribute('aria-checked', autoplayNext.toString());
        return autoplayNext;
    }
 
    function isVideoEnded(iframeDoc) {
        return iframeDoc.querySelector('.html5-endscreen.ytp-show-tiles') !== null;
    }
 
    // Main script
    function replaceElement(oldElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');
 
        if (!videoId) {
            console.error('Video ID not found in URL');
            return;
        }
 
        console.log(`Video ID: ${videoId}`);
        console.log('Old element found');
 
        // Calculate the size based on the current screen size
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
 
        // Set the width and height to 75% of the screen size
        const newWidth = screenWidth * 0.75;
        const newHeight = screenHeight * 0.75;
 
        // Create a container element for the iframe
        const container = document.createElement('div');
        container.style.width = newWidth + 'px';
        container.style.height = newHeight + 'px';
        container.style.margin = "0 auto"; // Center the container
        container.style.position = "relative"; // Position the container relative to the page
 
        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'YouTube Home';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.zIndex = '9999';
        closeButton.addEventListener('click', () => {
            window.location.href = 'https://www.youtube.com'; // Redirect to YouTube.com
        });
 
        // Create the iframe element
        const newElement = document.createElement('iframe');
        newElement.width = '100%';
        newElement.height = '100%';
        newElement.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        newElement.title = 'YouTube video player';
        newElement.frameBorder = '0';
        newElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        newElement.allowFullscreen = true;
 
        // Append the iframe and close button to the container
        container.appendChild(closeButton);
        container.appendChild(newElement);
 
        // Replace the old element with the container
        oldElement.parentNode.replaceChild(container, oldElement);
        console.log('Element replaced successfully');
 
        newElement.onload = () => {
            const iframeDoc = newElement.contentDocument;
 
            const refButton = iframeDoc.querySelector('.ytp-subtitles-button');
            const youtubeButton = iframeDoc.querySelector('.ytp-youtube-button');
 
            if (youtubeButton) {
                youtubeButton.parentNode.removeChild(youtubeButton);
            } else {
                console.error('YouTube button not found');
            }
 
            if (refButton) {
                const autoPlayButton = document.createElement('button');
                autoPlayButton.className = 'ytp-button';
                autoPlayButton.setAttribute('data-priority', '2');
                autoPlayButton.setAttribute('data-tooltip-target-id', 'ytp-autonav-toggle-button');
                autoPlayButton.title = getAutoplayState() ? 'Autoplay is on' : 'Autoplay is off';
                autoPlayButton.setAttribute('aria-label', getAutoplayState() ? 'Autoplay is on' : 'Autoplay is off');
                autoPlayButton.innerHTML = `
                    <div class="ytp-autonav-toggle-button-container">
                        <div class="ytp-autonav-toggle-button" aria-checked="${getAutoplayState().toString()}"></div>
                    </div>
                `;
 
                refButton.parentNode.insertBefore(autoPlayButton, refButton.nextSibling);
 
                autoPlayButton.addEventListener('click', () => {
                    const isAutoplayOn = toggleAutoplayState(autoPlayButton);
                    if (isAutoplayOn && isVideoEnded(iframeDoc)) {
                        playNextVideo();
                    }
                });
            } else {
                console.error('Reference button not found');
            }
 
            const endScreenObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.target.classList.contains('ytp-show-tiles') && getAutoplayState()) {
                        playNextVideo();
                        break;
                    }
                }
            });
 
            endScreenObserver.observe(iframeDoc, { attributes: true, subtree: true, attributeFilter: ['class'] });
        };
    }
 
    function playNextVideo() {
        const rendererElements = document.querySelectorAll('ytd-compact-video-renderer');
        for (let rendererElement of rendererElements) {
            if (!rendererElement.querySelector('ytd-compact-radio-renderer')) {
                const nextVideoLink = rendererElement.querySelector('a#thumbnail');
                if (nextVideoLink && nextVideoLink.href) {
                    const autoplayURL = new URL(nextVideoLink.href);
                    autoplayURL.searchParams.set('autoplay', '1');
                    console.log(`Found next video link: ${autoplayURL.href}`);
                    window.location.href = autoplayURL.href;
                    return;
                }
            }
        }
        console.error('Next video link not found');
    }
 
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeName.toLowerCase() === 'ytd-enforcement-message-view-model') {
                        replaceElement(node);
                    }
                }
            }
        }
    });
 
    observer.observe(document, { childList: true, subtree: true });
 
})();