// ==UserScript==
// @name         Video URL grabber 
// @namespace    https://github.com/Rainman69/video-link-grabber
// @version      1.0
// @description  Display video URLs and allow copying on the webpage while playing videos.
// @author       https://t.me/TheErfon
// @match        *://*/*
// @grant        GM_addStyle
// @license      CC BY-NC-ND 4.0
// @licenseURL   https://github.com/Rainman69/video-link-grabber/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/475138/Video%20URL%20grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/475138/Video%20URL%20grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the video URLs
    var videoURLContainer = document.createElement('div');
    videoURLContainer.style.position = 'fixed';
    videoURLContainer.style.top = '10px';
    videoURLContainer.style.left = '10px';
    videoURLContainer.style.padding = '5px';
    videoURLContainer.style.background = 'none';
    videoURLContainer.style.color = '#000';
    videoURLContainer.style.fontFamily = 'Times New Roman, serif';
    videoURLContainer.style.fontSize = '10px';
    videoURLContainer.style.zIndex = '9999';
    videoURLContainer.style.cursor = 'pointer';
    videoURLContainer.style.userSelect = 'none';
    videoURLContainer.style.opacity = '0';
    videoURLContainer.style.transition = 'opacity 0.3s ease-in-out';

    // Function to extract video URLs from <video> elements
    function extractVideoURLs() {
        var videoElements = document.getElementsByTagName('video');
        var videoURLs = [];

        for (var i = 0; i < videoElements.length; i++) {
            var videoElement = videoElements[i];
            var videoURL = videoElement.currentSrc || videoElement.src;
            if (videoURL) {
                videoURLs.push(videoURL);
            }
        }

        return videoURLs;
    }

    // Update the video URLs in the container
    function updateVideoURLs() {
        var videoURLs = extractVideoURLs();
        if (videoURLs.length > 0) {
            videoURLContainer.textContent = videoURLs.join('\n');
        } else {
            videoURLContainer.textContent = 'No video URLs found.';
        }
    }

    // Copy the video URL to the clipboard
    function copyURL() {
        var textarea = document.createElement('textarea');
        textarea.value = videoURLContainer.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        // Display a confirmation message
        videoURLContainer.style.opacity = '1';
        videoURLContainer.textContent = 'URL copied!';
        setTimeout(function() {
            videoURLContainer.style.opacity = '0';
            updateVideoURLs();
        }, 3000);
    }

    // Call the updateVideoURLs function initially
    updateVideoURLs();

    // Add the video URL container to the document body
    document.documentElement.appendChild(videoURLContainer);

    // Update the video URLs whenever the video elements on the page change
    var observer = new MutationObserver(updateVideoURLs);
    observer.observe(document.documentElement, { subtree: true, childList: true });

    // Show the video URL container when clicked
    videoURLContainer.addEventListener('click', copyURL);

    // Hide the video URL container on scroll
    var isScrolling;
    window.addEventListener('scroll', function() {
        videoURLContainer.style.opacity = '0';
        clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            videoURLContainer.style.opacity = '1';
        }, 300);
    });

    // Get the most used color on the target site and change the text color accordingly
    var colors = {};
    var elements = document.querySelectorAll('*');
    Array.prototype.forEach.call(elements, function(element) {
        var computedStyle = getComputedStyle(element);
        var color = computedStyle.color;
        if (color in colors) {
            colors[color]++;
        } else {
            colors[color] = 1;
        }
    });
    var mostUsedColor = Object.keys(colors).reduce(function(a, b) {
        return colors[a] > colors[b] ? a : b;
    }, '');
    videoURLContainer.style.color = mostUsedColor;

    // Add the custom styles to the page using GM_addStyle
    GM_addStyle(`
        * {
            color: ${mostUsedColor} !important;
        }
    `);
})();