// ==UserScript==
// @name         Universal <video> Fixer - bring back the seek bar, enable download, PiP, etc
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Makes <video> more usable across the web by enabling all controls, downloads, picture-in-picture, etc. May cause usability issues on some sites but is generally an improvment.
// @author       @varenc
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAANIaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4yPC90aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMDI0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xMDI0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Ck65VAAAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAYUExURSQkJjQ1NwMDA/Hz7gwMD9DSz6KlpXF0dUWDpyEAAAADdFJOUwT1ipnZE8QAAAKySURBVEjHrZVNj5swEIbTan/ApuuQe9U/UFmGa11NzBkZJ+cIQ84rPvbvd2aMExdnbzuHKIQnL8N8vN7tviBeNDwPrQOgBXxG/GWBPXwMT+MGwIA4Du55XPUfTmFx9mLlJspOKicYqHunxNsWaGv88K8EFM42usgAGKVsKEsoUED3W0ABSlQMLLaBwsohvd0HiZKBmQVK6JIMwbJEqRlgAS/GB1DpE0usgCcBXadpTCxhSmDgwgILlUI5Zx8SywpYtwqoG7ZFL3cJFwG5ClwB9nsAQxKAEuoOBIErHBfnzu90jyXkHWjFTFdH6qFTV3rjCt7uAF6RwLSnBgPWZaKHTHMCyMFi4sstzMnMRStdClDnjud1jsB6Eyv6ABQUPo7aiUq9BSo9PIbRTmMGtKYBbaoAvLWnDJgOHgHsEIUp6wyAWXANJyZUSCIBFKeAgOIt6aZuA5T1JQD4I8boPwfkhbMcN0BVNxGQWI9TO28B8wAUAYcM+H0HmqdAXUWAvhz8nCVZpm8xZ4DSaq0DV2oW29eUoguVDC3tIQP86AUCDd+vL7XNunnC14jdNK2x+TxIGqZ16KY566aEsY3zUp+hz4HWqGh3s6+3I8dL0q0ZFGf0DKlSoKIK+ZobCcd+4jXpEqAVfGXk+fYxuCsJ8HLegVIbHgSD5njGFSUByvORg+fS4nYf3+kZJGD+26wgEfzhA++TwGO7yzFKSEfrbWUQaOwKYPqrROJRvVXiFD2KrGCVWF2OBFooVsBNmh6X2GCpUQDqPjoMu8kttcGBBJZoYk4KlFDpiaBYwFUMoEteUv3o9mhoDQNUkemQnxe9s54BTRXJjwMUQJenA4VL6WRGYKWAjqTvgF7uyKMVU/g1fDo0NTqSdr8EGvCzgHAsosSn8RqO3m8/fsbgv1Hs8bfd18Q/+m3BBdhR+FsAAAAASUVORK5CYII=
// @license      MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531780/Universal%20%3Cvideo%3E%20Fixer%20-%20bring%20back%20the%20seek%20bar%2C%20enable%20download%2C%20PiP%2C%20etc.user.js
// @updateURL https://update.greasyfork.org/scripts/531780/Universal%20%3Cvideo%3E%20Fixer%20-%20bring%20back%20the%20seek%20bar%2C%20enable%20download%2C%20PiP%2C%20etc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixVideos() {
        // Process all videos on the page, making them downloadable and fully functional
        document.querySelectorAll("video").forEach((video, index) => {
            console.log(`VideoFixer: Processing <video> #${index + 1}:`, video);

            video.style.position = "relative";
            video.style.zIndex = "999999"; // <-- this is the real trick, forcing the native <video> controls to the front
            video.controls = true;
            video.style.pointerEvents = "auto";

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

            if (removedAttributes.length > 0 || removedControlsListItems.length > 0) {
                console.log(`VideoFixer: Removed restrictions from video #${index + 1}:`, {
                    removedAttributes,
                    removedControlsListItems
                });
            }
        });

        console.log("VideoFixer: All videos processed and fixed!");
    }

    // Set up a MutationObserver to detect new videos being added to the page
    function setupVideoObserver() {
        const videoObserver = new MutationObserver((mutations) => {
            let shouldProcess = false;

            // Check for new/modified <video>
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

            if (shouldProcess) {
                fixVideos();
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

    function initialize() {
        console.log("Universal Video Fixer activated!");
        fixVideos();
        setupVideoObserver();
    }

    // Wait for the DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Run a check after a short delay to catch videos that load after initial page load, but were missed by the mutation observer
    setTimeout(fixVideos, 2000);
})();