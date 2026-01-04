// ==UserScript==
// @name         HTML5 Video Screenshot with Button
// @version      1.0
// @description  Capture screenshot from HTML5 video player using button or Ctrl+Shift+S
// @match        *://*/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1349839
// @downloadURL https://update.greasyfork.org/scripts/503312/HTML5%20Video%20Screenshot%20with%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/503312/HTML5%20Video%20Screenshot%20with%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function captureScreenshot(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]).then(() => {
                showTip('Screenshot copied to clipboard');
            }).catch((error) => {
                showTip('Failed to copy screenshot', true);
                console.error('Failed to copy screenshot: ', error);
            });
        }, 'image/png');
    }

    function showTip(message, isError = false) {
        const tip = document.createElement('div');
        tip.textContent = message;
        tip.style.position = 'fixed';
        tip.style.bottom = '20px';
        tip.style.right = '20px';
        tip.style.padding = '10px';
        tip.style.backgroundColor = isError ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        tip.style.color = 'white';
        tip.style.borderRadius = '5px';
        tip.style.zIndex = '9999999';
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 3000);
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '5px 10px';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.transition = 'opacity 0.3s';
        button.style.opacity = '0';
        button.onclick = onClick;
        return button;
    }

    function addControlsToVideo(video) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = '10px';
        wrapper.style.right = '10px';
        wrapper.style.zIndex = '9999998';

        const screenshotButton = createButton('📷', (e) => {
            e.preventDefault();
            e.stopPropagation();
            captureScreenshot(video);
        });

        wrapper.appendChild(screenshotButton);

        let hideTimeout;
        let isMouseOverControls = false;

        function showControls() {
            screenshotButton.style.opacity = '1';
            clearTimeout(hideTimeout);
            if (!isMouseOverControls) {
                hideTimeout = setTimeout(() => {
                    if (!isMouseOverControls) {
                        screenshotButton.style.opacity = '0';
                    }
                }, 2000);
            }
        }

        // Show controls on mouse move and hide after 2 seconds of inactivity
        video.parentElement.addEventListener('mousemove', showControls);
        video.parentElement.addEventListener('mouseenter', showControls);

        // Clear timeout when leaving the video area
        video.parentElement.addEventListener('mouseleave', () => {
            if (!isMouseOverControls) {
                screenshotButton.style.opacity = '0';
                clearTimeout(hideTimeout);
            }
        });

        // Keep controls visible when mouse is over them
        wrapper.addEventListener('mouseenter', () => {
            isMouseOverControls = true;
            clearTimeout(hideTimeout);
            screenshotButton.style.opacity = '1';
        });

        wrapper.addEventListener('mouseleave', () => {
            isMouseOverControls = false;
            showControls();
        });

        // Create a wrapper for the video if it doesn't exist
        let videoWrapper = video.parentElement;
        if (!videoWrapper.style.position || videoWrapper.style.position === 'static') {
            videoWrapper = document.createElement('div');
            videoWrapper.style.position = 'relative';
            videoWrapper.style.display = 'inline-block';
            video.parentNode.insertBefore(videoWrapper, video);
            videoWrapper.appendChild(video);
        }

        videoWrapper.appendChild(wrapper);

        // Add keyboard shortcut functionality to the button
        screenshotButton.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                captureScreenshot(video);
            }
        });
    }

    // Listen for the shortcut key (Ctrl+Shift+S)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            const video = document.querySelector('video');
            if (video) {
                captureScreenshot(video);
            } else {
                showTip('No video element found on the page', true);
            }
        }
    });

    // Add controls to video players
    function addControlsToVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(addControlsToVideo);
    }

    // Initial addition of controls
    addControlsToVideos();

    // Use a MutationObserver to add controls to dynamically loaded videos
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') {
                        addControlsToVideo(node);
                    } else if (node.querySelector) {
                        const videos = node.querySelectorAll('video');
                        videos.forEach(addControlsToVideo);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();