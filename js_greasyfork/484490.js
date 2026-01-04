// ==UserScript==
// @name         Youtube Playlist Duration
// @description  Shows the duration of youtube playlists.
// @namespace    https://greasyfork.org/users/1142347
// @version      1.0
// @author       Caassiiee
// @icon         https://www.youtube.com/favicon.ico
// @match        *://*.youtube.com/*
// @noframes
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/484490/Youtube%20Playlist%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/484490/Youtube%20Playlist%20Duration.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let interval = null;

    function attachTimesContainer() {
        let sibling = document.querySelector('.metadata-stats');
        const container = document.createElement('div');
        container.className = 'metadata-stats ytd-playlist-byline-renderer';
        const totalTimeSpan = document.createElement('span');
        totalTimeSpan.id = 'total-time';
        totalTimeSpan.className = 'byline-item style-scope ytd-playlist-byline-renderer';
        container.appendChild(totalTimeSpan);
        sibling.parentNode.insertBefore(container, sibling.nextSibling);
    }

    function attachTimesInterval() {
        getTimes();
        interval = setInterval(function () {
            getTimes();
        }, 1000);
    }

    function getTimes() {
        let totalTime = [0, 0, 0];
        console.log('getTimes');

        document.querySelectorAll('ytd-playlist-video-list-renderer #time-status').forEach(function (span) {
            let time = span.innerText;
            let times = time.split(':');
            while (times.length < 3) {
                times.unshift(0);
            }
            for (let i = 0; i < times.length; i++) {
                const parsed = parseInt(times[i]);
                times[i] = isNaN(parsed) ? 0 : parsed;
                totalTime[i] += times[i];
            }
            for (let i = totalTime.length - 1; i >= 0; i--) {
                if (i !== 0) {
                    while (totalTime[i] > 59) {
                        totalTime[i - 1]++;
                        totalTime[i] -= 60;
                    }
                }
            }
        });

        for (let i = 0; i < totalTime.length; i++) {
            if (i !== 0 && totalTime[i] < 10) {
                totalTime[i] = '0' + totalTime[i].toString();
            } else {
                totalTime[i] = totalTime[i].toString();
            }
        }

        let totalTimeString = totalTime.join(':');
        document.querySelector('#total-time').innerText = totalTimeString;
    }

    document.addEventListener('yt-navigate-finish', () => {
        const main = document.querySelector('ytd-browse[role="main"]');
        if (main) {
            const meta = main.querySelector('.metadata-stats');
            if (meta) {
                const totalTimeSpan = document.querySelector('#total-time');
                if (totalTimeSpan) {
                    totalTimeSpan.innerText = '';
                } else {
                    attachTimesContainer();
                }
                attachTimesInterval();
            } else {
                clearInterval(interval);
            }
        } else {
            clearInterval(interval);
        }
    });
})();