// ==UserScript==
// @name         Unbreak Snapchat web. Disable focus tracking, screenshot prevention, and enable video downloads
// @name:zh-CN   修复Snapchat网络版：禁用焦点追踪、屏幕截图防护，并启用视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1.4.1
// @description  Improve the Snapchat web experience by disabling screenshot prevention features which don't prevent screenshots but do actively harm the usability. And enabling video downloads
// @description:zh-CN  通过禁用防护功能并启用视频下载，改善Snapchat网络版的体验。
// @homepage     https://gist.github.com/varenc/20e4dbfe8e7a2cc305043ffcbc5454d0
// @author       https://github.com/varenc
// @match        https://web.snapchat.com/*
// @match        https://www.snapchat.com/web/*
// @icon         http://snapchat.com/favicon.ico
// @license      MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468156/Unbreak%20Snapchat%20web%20Disable%20focus%20tracking%2C%20screenshot%20prevention%2C%20and%20enable%20video%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/468156/Unbreak%20Snapchat%20web%20Disable%20focus%20tracking%2C%20screenshot%20prevention%2C%20and%20enable%20video%20downloads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function __unblockControlKeyEvents() {
        const events = ["keydown", "keyup", "keypress"];
        const modifyKeys = ["Control", "Meta", "Alt", "Shift"];
        for (var i = 0; i < events.length; i++) {
            var event_type = events[i];
            document.addEventListener(
                event_type,
                function (e) {
                    // console.log(`${event_type}[${i}]=`, e.key);
                    if (modifyKeys.includes(e.key)) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`'${event_type}' event for '${e.key}' received and prevented:`, e);
                        e.stopImmediatePropagation();
                    }
                },
                true
            );
        }
    }

    function __unblockEvent() {
        for (var i = 0; i < arguments.length; i++) {
            var event_type = arguments[i];
            document.addEventListener(
                arguments[i],
                function (e) {
                    // e.preventDefault();
                    e.stopPropagation();
                    console.log(`'${event_type}' event received and prevented:`, e);
                    // e.stopImmediatePropagation();
                },
                true
            );
        }
    }

    function __fixConsole() {
        // snapchat tries to disable console.log.. how mean. So we copy the real Console object from a new iframe
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const nativeConsole = iframe.contentWindow.console;
        window.console = nativeConsole;
    }

    function __enableVideoDownloads() {
        // Process all videos on the page, making them downloadable and fully functional
        document.querySelectorAll("video").forEach((video, index) => {
            console.log(`VideoFixer: Processing <video> #${index + 1}:`, video);

            // Make video visible and interactive
            video.style.position = "relative";
            video.style.zIndex = "999999";
            video.controls = true;
            video.style.pointerEvents = "auto";

            // Track and remove restrictive attributes
            const removedAttributes = [];
            const removedControlsListItems = [];

            // Remove attributes that restrict functionality
            ["disablePictureInPicture", "disableRemotePlayback"].forEach((attr) => {
                if (video.hasAttribute(attr)) {
                    removedAttributes.push(attr);
                    video.removeAttribute(attr);
                }
            });

            // Remove controlsList restrictions
            if (video.hasAttribute("controlsList")) {
                removedControlsListItems.push(...video.getAttribute("controlsList").split(/\s+/));
                video.removeAttribute("controlsList");
            }
        });

        console.log("VideoFixer: All videos processed and fixed!");
    }

    // Set up a MutationObserver to detect new videos being added to the page
    function __setupVideoObserver() {
        // Create a MutationObserver to watch for new video elements
        const videoObserver = new MutationObserver((mutations) => {
            let shouldProcess = false;

            // Check if any videos were added or modified
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const addedVideos = Array.from(mutation.addedNodes).filter(node =>
                        node.nodeName === 'VIDEO' ||
                        (node.nodeType === Node.ELEMENT_NODE && node.querySelector('video'))
                    );

                    if (addedVideos.length > 0) {
                        shouldProcess = true;
                        break;
                    }
                } else if (mutation.type === 'attributes' &&
                          mutation.target.nodeName === 'VIDEO') {
                    shouldProcess = true;
                    break;
                }
            }

            // If videos were added or modified, process all videos
            if (shouldProcess) {
                __enableVideoDownloads();
            }
        });

        videoObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'controlsList', 'disablePictureInPicture', 'disableRemotePlayback'],
            attributeOldValue: true
        });

        return videoObserver;
    }

    function __setupUnblocker() {
        __fixConsole();
        __unblockControlKeyEvents();

        ///////// NOTE /////////
        // The below makes right-click work like normal, but it also disables Snapchat's special right click behavior in certain places.
        __unblockEvent("contextmenu");

        // Process any videos that are already on the page
        __enableVideoDownloads();
    }
    console.dir("Snapchat unbreaker running!")  // Snapchat doesn't disable `console.dir`... silly Snapchat.
    // Wait for the DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            __setupUnblocker();
            __setupVideoObserver();
        });
    } else {
        __setupUnblocker();
        __setupVideoObserver();
    }
    // Run a few extra times to ensure our event listeners take priority.
    setTimeout(__setupUnblocker, 1000);
    setTimeout(__setupUnblocker, 5000);
    setTimeout(__setupUnblocker, 10000);

    // Also set up a periodic check every 30 seconds as a fallback
    setInterval(__enableVideoDownloads, 30000);
    // Works 90% of the time, but they also use some other method to check focus I haven't tracked down yet.
    document.hasFocus = function(){return true}
})();