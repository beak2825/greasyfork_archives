// ==UserScript==
// @name         Loop Fix
// @description  Saving loop for current tab and fixes video repeating in playlist
// @version      0.1.19
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507990/Loop%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/507990/Loop%20Fix.meta.js
// ==/UserScript==

(() => {
    function blockEvents(condition, ...events) {
        events = events.flat();
        const tag = window.EventTarget.prototype;
        tag._add = tag.addEventListener;
        tag.addEventListener = function (name, callback, options) {
            if (!events.includes(name)) return tag._add.call(this, name, callback, options);

            function cb(e) {
                if (!condition.call(this)) return;
                callback.call(this, e);
            };

            tag._add.call(this, name, cb, options);
        };
    }

    blockEvents(function() {
        return !this.loop; // have loop = block events
    }, 'pause', 'timeupdate', 'waiting');
})();

window.loopState = JSON.parse(window.sessionStorage.getItem('loopState')) ?? false;
function clicking(e) {
    window.loopState = JSON.parse(this.ariaChecked);
    window.sessionStorage.setItem('loopState', window.loopState);
};

window.setInterval(()=>{
    if (!location.href.includes('watch') && !location.href.includes('shorts')) return;
    const vid = window.document.querySelector('video.html5-main-video');
    if (!vid) return;
    // apply loopState after .src or page refresh
    if (vid.loop != window.loopState) vid.loop = window.loopState;
    // attach loop click detector
    const repeat = window.document.querySelectorAll('.ytp-menuitem[tabindex="-1"]')[0];
    if (repeat && repeat.onclick != clicking) {
        repeat.onclick = clicking;
    }
});