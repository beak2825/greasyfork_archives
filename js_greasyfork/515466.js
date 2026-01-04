// ==UserScript==
// @name         YouTube Cobalt Tools Download Button Lite
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds a download button to YouTube videos using Cobalt Frontend for downloading videos.
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://*.youtube.com/*
// @match        *://*cobalt.tools/*
// @run-at       document-idle
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/515466/YouTube%20Cobalt%20Tools%20Download%20Button%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/515466/YouTube%20Cobalt%20Tools%20Download%20Button%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

  let currentPageUrl = window.location.href;
  let initialInjectDelay = 2000; // Initial delay in milliseconds
  let cobaltInitialInjectDelay = 2000; // Cobalt Initial delay in milliseconds
  let navigationInjectDelay = 1000; // Delay on navigation in milliseconds

  // Check if currentPageUrl is YouTube video
  function isCobaltURL() {
    return (window.yt==undefined);
  }

  function isYouTubeWatchURL() {
    return window.location.href.includes("youtube.com/watch?");
  }

  function removeElement(elementToRemove) {
    var element = document.querySelector(elementToRemove);
    if (element) {
        element.remove();
    }
  }

  function waitForLoadingComplete(element) {
    return new Promise((resolve) => {
        const checkLoadingState = setInterval(() => {
            const icon = document.querySelector(element);

            if (icon && !icon.className.includes("loading")) {
                clearInterval(checkLoadingState);
                resolve();
            }
        }, 100);
    });
  }

  function waitForSaveDownloadButton() {
    return new Promise((resolve) => {
        const checkButtonState = setInterval(() => {
            const button = document.querySelector("#button-save-download");

            if (button) {
                clearInterval(checkButtonState);
                resolve();
            }
        }, 100);
    });
  }

  function cobaltWebsiteSimulation() {
    // Function to check if input length is greater than 5
    if (window.document.getElementById('link-area').value.length > 5) {
      document.getElementById('download-button').click();
      waitForSaveDownloadButton().then(() => {
          document.querySelector("#button-save-download").click()
          // close the cobalt tab
          setTimeout(() => {
              window.close();
          }, 1000);
      });
    }
  }

    // Helper function to check if two arrays are equal (for detecting changes)
    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    // Function to inject download button on the page
    function injectDownloadButton() {
        setTimeout(() => {
            // Remove existing download button if present
            removeElement('#cobalt-download-btn');

            const downloadButton = document.createElement('button');
            downloadButton.id = 'cobalt-download-btn';
            downloadButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading';
            downloadButton.setAttribute('aria-label', 'Download');
            downloadButton.setAttribute('title', 'Download');
            downloadButton.innerHTML = `
                <div class="yt-spec-button-shape-next__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: inline-block; width: 24px; height: 24px; vertical-align: middle;">
                        <path fill="currentColor" d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path>
                    </svg>
                </div>
                <div class="yt-spec-button-shape-next__button-text-content">Download</div>
            `;
            downloadButton.style.borderRadius = '30px';
            downloadButton.style.fontSize = '14px';
            downloadButton.style.padding = '8px 16px';
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.marginLeft = '8px';
            downloadButton.style.marginRight = '0px';

            downloadButton.onclick = () => window.open("https://cobalt.tools/#" + window.location.href, '_blank', 'noopener,noreferrer');

            const actionMenu = document.querySelector('.top-level-buttons');
            actionMenu.appendChild(downloadButton);
        }, initialInjectDelay);
    }

    // Function to remove native YouTube download button
    function removeNativeDownloadButton() {
      setTimeout(() => {
          // Remove download button from overflow menu
          removeElement('ytd-menu-service-item-download-renderer');

          // Remove download button next to like/dislike buttons
          var overFlowButton = document.querySelector('button[aria-label="More actions"]');
          overFlowButton.click();
          removeElement('ytd-download-button-renderer');
          overFlowButton.click();
      }, initialInjectDelay);
    }

    // Function to initialize download button on YouTube video page
    function initializeDownloadButton() {
        injectDownloadButton();
        removeNativeDownloadButton();
    }

    // Initialize on page load
    if (isYouTubeWatchURL()) {
      setTimeout(() => {
          initializeDownloadButton();
      }, initialInjectDelay);
    }

    if (isCobaltURL()) {
      setTimeout(() => {
          waitForLoadingComplete("#input-icons").then(() => {
            cobaltWebsiteSimulation();
          });
      }, cobaltInitialInjectDelay);
    }

    // Monitor URL changes using history API
    window.onpopstate = function(event) {
        setTimeout(() => {
            if (currentPageUrl !== window.location.href) {
                currentPageUrl = window.location.href;
                console.log('URL changed:', currentPageUrl);
                if (isYouTubeWatchURL()) {
                  initializeDownloadButton(); // Reinitialize download button on URL change
                }

                // Close the format/quality picker menu if a new video is clicked
                removeElement('#cobalt-quality-picker');
            }
        }, navigationInjectDelay);
    };

    // Monitor DOM changes using MutationObserver
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.target.classList.contains('html5-video-player')) {
                console.log('Video player changed');
                setTimeout(() => {
                    currentPageUrl = window.location.href;
                    if (isYouTubeWatchURL()) {
                      initializeDownloadButton(); // Reinitialize download button if video player changes
                    }
                }, navigationInjectDelay);

                // Close the format/quality picker menu if a new video is clicked
                removeElement('#cobalt-quality-picker');
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();