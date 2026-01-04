// ==UserScript==
// @name         Plex volume with mousewheel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add volume control with mouse wheel on plex
// @author       KarmaKat
// @include      /^https?://[^/]*plex[^/]*/
// @include      /^https?://[^/]*:32400/
// @match        https://app.plex.tv/
// @match        https://plex.tv/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537476/Plex%20volume%20with%20mousewheel.user.js
// @updateURL https://update.greasyfork.org/scripts/537476/Plex%20volume%20with%20mousewheel.meta.js
// ==/UserScript==

(function() {
    // Wait for the DOM to load
    let playPauseOverlay;
    function waitForElement(querySelector) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(querySelector)) {
                playPauseOverlay = document.querySelector(querySelector);
                resolve();
            }
            const observer = new MutationObserver(() => {
                if (document.querySelector(querySelector)) {
                    observer.disconnect();
                    playPauseOverlay = document.querySelector(querySelector);
                    return resolve();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForElement('[class*="PlayPauseOverlay-overlay"]').then((r,f) => {
        playPauseOverlay.addEventListener("wheel", (event) => {
            const fill = document.querySelector("[class*='VolumeSlider-fill']");
            const thumb = document.querySelector("[class*='VerticalSlider-thumbTrack']");
            const thumbBtn = thumb?.querySelector('button');
            let volume = document.querySelector("video").volume
            if (event.deltaY > 0) {
                volume -= 0.05;
            }
            else {
                volume += 0.05;
            }
            volume = Math.max(0, Math.min(1, volume));

            const track = thumbBtn.closest("[class*='PlayerControls-volumeSlider']");
            if (!track) return;

            const rect = track.getBoundingClientRect();
            const percent = 1 - volume;

            const y = rect.top + percent * rect.height;

            ['mousedown', 'mousemove', 'mouseup'].forEach(eventType => {
                const evt = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    clientX: rect.left + rect.width / 2,
                    clientY: y
                });
                thumbBtn.dispatchEvent(evt);
            });

            //console.log(document.querySelector("video").volume);
        });
    });

})();








