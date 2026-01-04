// ==UserScript==
// @name         Refresh Video
// @description  Auto refresh youtube if video freezed/stopped downloading
// @version      0.1.20
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511988/Refresh%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/511988/Refresh%20Video.meta.js
// ==/UserScript==

// refresh if no reply during these actions
const maxLoadingTime = 1500;
const maxSeekingTime = 1500;

let created = false;
let refreshing = false;
let loaded = false;
let navigating = true;
let seeking = false;
let seekingId = 0;

const policy = window.trustedTypes && window.trustedTypes.createPolicy ? window.trustedTypes.createPolicy('timeout', {createScriptURL: str => str}) : {createScriptURL: str => str};
const timeout = delay => URL.createObjectURL(new Blob([`setTimeout(() => postMessage(0), ${delay});`]));
const refreshOnLoad = policy.createScriptURL(timeout(maxLoadingTime));
const seekingDebounce = policy.createScriptURL(timeout(500));

document.addEventListener('yt-navigate-start', () => {
    if (!location.href.includes('watch') && !location.href.includes('shorts')) return;
    navigating = true;
    loaded = false;
});
document.addEventListener('yt-navigate-finish', () => {
    if (!location.href.includes('watch') && !location.href.includes('shorts')) return;
    navigating = false;
});

let focused = false;
window.setInterval(()=>{
    if (!location.href.includes('watch') && !location.href.includes('shorts')) {
        focused = false;
        created = false;
        refreshing = false;
        loaded = false;
        navigating = true;
        seeking = false;
        seekingId = 0;
        return;
    }

    if (!focused) {
        focused = document.hasFocus();
        return;
    }

    const vid = window.document.querySelector('video.html5-main-video');
    if (!vid) return;
    if (!created) {
        created = true;
        vid.addEventListener('seeking', () => {
            clearTimeout(seekingId);
            seeking = true;
            seekingId = setTimeout(() => {
                seeking = false;
            }, maxSeekingTime);
        });

        // refresh if no data for half sec
        const callback = () => {
            if (!loaded && vid.readyState === window.HTMLMediaElement.HAVE_NOTHING) {
                window.location.href = window.location.href;
            }
        };
        new Worker(refreshOnLoad).onmessage = callback;
    }

    // to prevent early page refresh
    if (vid.readyState === window.HTMLMediaElement.HAVE_CURRENT_DATA || vid.readyState === window.HTMLMediaElement.HAVE_ENOUGH_DATA) loaded = !navigating;
    const noData = vid.readyState === window.HTMLMediaElement.HAVE_CURRENT_DATA || vid.readyState === window.HTMLMediaElement.HAVE_METADATA;
    if (loaded && !refreshing && noData && !seeking && !vid.paused && +vid.currentTime.toFixed(0) >= +vid.buffered.end(0).toFixed(0) - 2 && +vid.currentTime.toFixed(0) < +vid.duration.toFixed(0) - 2) {
        refreshing = true;
        const callback = () => {
            if (seeking) {
                refreshing = false;
                return;
            }
            window.location.href = window.location.href.split('?')[0] + '?t=' + (+vid.currentTime.toFixed(0)) + '&' + window.location.href.split('?')[1];
        };
        new Worker(seekingDebounce).onmessage = callback;
    }
});