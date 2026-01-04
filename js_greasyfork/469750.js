// ==UserScript==
// @name         YouTube Exit Fullscreen on Video End (Modified)
// @namespace    https://www.youtube.com/
// @version      1.3.2
// @description  Exit YouTube fullscreen when a video finishes playing (disabled for playlists)
// @author       CY Fung
// @match        *://www.youtube.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469750/YouTube%20Exit%20Fullscreen%20on%20Video%20End%20%28Modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469750/YouTube%20Exit%20Fullscreen%20on%20Video%20End%20%28Modified%29.meta.js
// ==/UserScript==

(() => {

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    let lastPause = 0;
    let lastFullscreenEnded = 0;
    let mutObserver = null;
    let dt0 = Date.now() - 2000;
    const nowFn = () => Date.now() - dt0;

    const check = () => {
        let t = nowFn();
        return t - lastFullscreenEnded < 800 && t - lastPause < 800 && Math.abs(lastFullscreenEnded - lastPause) < 400;
    };

    const mCallback = (mutations) => {
        if (!document.fullscreenElement || !mutations || !mutations.length) return;
        let detected = false;
        let video = null;
        for (const mutation of mutations) {
            video = (mutation || 0).target;
            if (!video) continue;
            const newValue = video.className;
            const oldValue = mutation.oldValue;
            if (newValue.indexOf("ended-mode") >= 0 && oldValue.indexOf("ended-mode") < 0) {
                detected = true;
                break;
            }
        }
        if (detected) {
            if (video && video.classList.contains("ended-mode")) {
                lastFullscreenEnded = nowFn();
                check() && endFullscreen(video);
            }
        }
    };

    const endFullscreen = (elm) => {
        lastPause = 0;
        lastFullscreenEnded = 0;
        if(location.search.includes("list=")) return;
        const movie_player = HTMLElement.prototype.closest.call(elm, '#movie_player');
        const btn = movie_player ? HTMLElement.prototype.querySelector.call(movie_player, '.ytp-fullscreen-button') : null;
        Promise.resolve(btn).then(btn => {
            if (btn) {
                btn.click();
            } else {
                document.exitFullscreen();
            }
        })
    };

    const setup = () => {
        const movie_player = location.pathname.includes("/watch") ? document.getElementById('movie_player') : null;
        if (movie_player) {
            if (!mutObserver) {
                mutObserver = new MutationObserver(mCallback);
            } else {
                mutObserver.disconnect();
                mutObserver.takeRecords();
            }
            mutObserver.observe(movie_player, {
                attributes: true,
                attributeFilter: ['class'],
                attributeOldValue: true
            });
        } else if (mutObserver) {
            mutObserver.disconnect();
            mutObserver.takeRecords();
            mutObserver = null;
        }
    };

    const onPause = (evt) => {
        const target = ((evt || 0).target || 0);
        if (!(target instanceof HTMLVideoElement)) return;
        if (mutObserver === null) return;
        const movie_player = HTMLElement.prototype.closest.call(target, '#movie_player');
        if (!movie_player) return;
        lastPause = nowFn();
        check() && endFullscreen(target);
    };

    document.addEventListener('yt-navigate-finish', setup, false);
    document.addEventListener('spfdone', setup, true);
    document.addEventListener("pause", onPause, true);
    setup();
})();