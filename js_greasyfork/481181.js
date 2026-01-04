// ==UserScript==
// @name         YouTube AdBlockerBlocker Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace YouTube Adblock warning with Youtube embeded Video
// @author       cgadumer
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @run-at       document-idle
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/481181/YouTube%20AdBlockerBlocker%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/481181/YouTube%20AdBlockerBlocker%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.YouTubeElementReplacement = true;

    var maxRetryCount = 10;
    var currentRetryCount = 0;
    var retryInterval;
    var currentURL = window.location.href;

    function getVideoId() {
        var videoID = 0;
        var videoIDMatch = currentURL.match(/[?&]v=([^&]+)/);
        if (videoIDMatch && videoIDMatch[1]) {
            videoID = videoIDMatch[1];
        }
        return videoID;
    }

    function addIframe(containerElement, videoID) {
        var iframeElement = document.createElement('iframe');
        iframeElement.id = 'ytreplacecontainer';
        var windowWidth = window.innerWidth;
        var videoWidth = Math.min(windowWidth * 0.63);
        var aspectRatio = 9 / 16;
        var videoHeight = videoWidth * aspectRatio;

        iframeElement.width = videoWidth;
        iframeElement.height = videoHeight;
        iframeElement.src = 'https://www.youtube.com/embed/' + videoID;
        iframeElement.title = 'YouTube video player';
        iframeElement.frameBorder = '0';
        iframeElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframeElement.allowFullscreen = true;

        containerElement.innerHTML = '';
        containerElement.appendChild(iframeElement);
    }

    function replaceContainer() {
        if (currentRetryCount >= maxRetryCount) {
            clearInterval(retryInterval);
            retryInterval = 0;
        } else {
            currentRetryCount++;

            var containerElement = document.getElementById('player');

            if (containerElement) {
                var adBlockerSpan = document.querySelector('span.yt-core-attributed-string--white-space-pre-wrap');
                var isAdBlockerTextPresent = adBlockerSpan !== null;

                var iframeElement = document.getElementById('ytreplacecontainer');
                var isIframePresent = iframeElement !== null;

                if (isAdBlockerTextPresent || isIframePresent) {
                    var videoID = getVideoId();
                    addIframe(containerElement, videoID);
                    clearInterval(retryInterval);
                    retryInterval = 0;
                }
            }
        }
    }

    function handleWindowSizeChange() {
        // Hier wird dein Code für die Reaktion auf die Größenänderung ausgeführt
        replaceContainer()
    }

    // Hinzufügen des Event Listeners für die Fenstergröße
    window.addEventListener('resize', handleWindowSizeChange);


    function handleDomChanges(mutationsList, observer) {
        var tempURL = window.location.href;
        if (tempURL != currentURL) {
            currentURL = tempURL;
            replaceContainer();
        }
    }

    var observer = new MutationObserver(handleDomChanges);
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(function () {
        retryInterval = setInterval(replaceContainer, 1000);
    }, 3000);

})();
