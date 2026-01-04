// ==UserScript==
// @name         YouTube Best Parts Looper
// @namespace    https://greasyfork.org/en/users/1413127-tumoxep
// @version      1.2
// @description  An attempt to implement loop for specified parts of YouTube videos. Doesn't work for background tabs.
// @license      WTFPL
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525213/YouTube%20Best%20Parts%20Looper.user.js
// @updateURL https://update.greasyfork.org/scripts/525213/YouTube%20Best%20Parts%20Looper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getTime(timeSrc) {
        if (typeof timeSrc === "number") {
            return timeSrc;
        }
        return timeSrc
            .split(':')
            .map(Number)
            .reduce((acc, val) => acc * 60 + val, 0);
    }

    const bestParts = [
        // replace with yours
        { v: 's6sZzgV5k8w', start: 14210.05, end: 14231.5 },
        { v: 'ZCzTYOaK_Ps', start: 29.9, end: 77.8 },
        { v: '_gNkftpGybU', start: 71.2, end: 136.55 },
        { v: 'qYwgG2oyUbA', start: "0:30", end: "3:30" },
        { v: '9bUUnyHYwCU', start: "0:45.5", end: "1:54.25" },
    ].map(el => ({
        v: el.v,
        start: getTime(el.start),
        end: getTime(el.end),
    }));

    let currentVideoId;

    function enableLoop(video, start, end, videoId) {
        function loopCheck() {
            if (videoId !== currentVideoId) {
                return;
            }
            if (video.currentTime >= end) {
                video.currentTime = start;
                video.play();
            }
            requestAnimationFrame(loopCheck);
        }
        requestAnimationFrame(loopCheck);
    }

    function setupLoop() {
        currentVideoId = new URLSearchParams(window.location.search).get('v');
        if (!bestParts.find(el => el.v === currentVideoId)) {
            return;
        }
        const video = document.querySelector('video');
        if (!video) {
            return;
        }
        bestParts.filter(p => p.v === currentVideoId).forEach(p => enableLoop(video, p.start, p.end, currentVideoId));
    }

    let lastUrl = location.href;
    setupLoop();
    setInterval(() => {
        if (location.href === lastUrl) {
            return;
        }
        lastUrl = location.href;
        setupLoop();
    }, 500);
})();
