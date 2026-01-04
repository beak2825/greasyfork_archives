// ==UserScript==
// @name         Youtube Music fix performance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to fix the performance issues that youtube music has
// @author       Marco Pfeiffer <git@marco.zone>
// @match        https://music.youtube.com/*
// @icon         https://music.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432304/Youtube%20Music%20fix%20performance.user.js
// @updateURL https://update.greasyfork.org/scripts/432304/Youtube%20Music%20fix%20performance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const global = window.unsafeWindow ?? window;
    const setInterval = global.setInterval;
    const clearInterval = global.clearInterval;
    const intervals = new Set();

    global.setInterval = function(fn, ms) {
        const n = setInterval.call(this, fn, ms);
        console.log("setup interval", n, fn, ms, "still pending timers", Array.from(intervals));
        intervals.add(n);
        return n;
    };
    global.clearInterval = function (n) {
        if (!intervals.delete(n)) {
            console.log("failed cleanup of", n, "still pending timers", Array.from(intervals));
            if (intervals.size > 5) {
                const timersToCleanUp = Array.from(intervals).slice(0, -5);
                console.log("cleanup timers", timersToCleanUp);
                timersToCleanUp.forEach(clearInterval);
            }
        } else {
            console.log("cleanup interval", n, "still pending timers", Array.from(intervals));
        }
        return clearInterval.call(this, n);
    };
})();