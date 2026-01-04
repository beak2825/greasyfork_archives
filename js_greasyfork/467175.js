// ==UserScript==
// @name         YouTube Video Name Handler
// @namespace    your-namespace
// @version      1.1.4
// @description  Adds a "Start Logging" button to send the names of YouTube videos to locahost
// @author       Kam1k4dze
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect localhost
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467175/YouTube%20Video%20Name%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/467175/YouTube%20Video%20Name%20Handler.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create the "Start Logging" button
    const startLoggingButton = document.createElement('button');
    startLoggingButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading';
    startLoggingButton.textContent = 'Start Logging';
    //startLoggingButton.style.position = 'relative';
    //startLoggingButton.style.bottom = '10px';
    //startLoggingButton.style.right = '10px';
    //startLoggingButton.style.zIndex = '9999'; // Set the z-index to a high value
    startLoggingButton.addEventListener('click', toggleLogging);

    //document.body.appendChild(startLoggingButton);
    setTimeout(() => {
        document.evaluate("//div[@id='panels']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.appendChild(startLoggingButton);
    }, 3000);
    const link_observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                setTimeout(() => {
                    document.evaluate("//div[@id='panels']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.appendChild(startLoggingButton);
                }, 3000);
            }
        });
    });

    link_observer.observe(document, {
        attributes: true,
        subtree: true
    });
    let isLogging = false;
    let currentVideoName = '';
    // Function to toggle logging
    function toggleLogging() {
        isLogging = !isLogging;

        if (isLogging) {
            startLoggingButton.textContent = 'Stop Logging';
            updateCurrentVideoName();
            currentVideoName = getCurrentVideoName();

            updateFileName();


        } else {
            startLoggingButton.textContent = 'Start Logging';
            currentVideoName = '';
        }
    }

    // Function to update the name of the currently playing video
    function updateCurrentVideoName() {
        const observer = new MutationObserver(() => {

            const newVideoName = getCurrentVideoName();
            if (newVideoName !== currentVideoName) {

                currentVideoName = newVideoName;
                updateFileName();
            }
        });

        observer.observe(document.querySelector('.ytp-title-link'), {
            childList: true,
            subtree: true
        });
    }

    // Function to get the name of the currently playing video
    function getCurrentVideoName() {
        const titleElement = document.querySelector('.ytp-title-link');
        return titleElement ? titleElement.textContent : '';
    }

    // Function to update the file name in the download attribute
    function updateFileName() {
        const payload = {
            name: currentVideoName,
            link: window.location.href
        };
        console.log(currentVideoName);
        GM_xmlhttpRequest({
            method: 'OPTIONS',
            url: 'http://localhost:8080/',
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function() {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'http://localhost:8080/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(payload),
                    onload: function(response) {
                        console.log(response.responseText);
                    }
                });
            }
        });
    }
})();