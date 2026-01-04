// ==UserScript==
// @name         OkkyTimestone
// @namespace    github.com/dohyeongk
// @version      0.1
// @description  Fix time in okky to local time
// @author       You
// @match        https://okky.kr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438521/OkkyTimestone.user.js
// @updateURL https://update.greasyfork.org/scripts/438521/OkkyTimestone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const updateTime = function(root) {
        const currentTimeMilli = Date.now();
        const toString = function(renderTimeMilli) {
            let diff = currentTimeMilli - renderTimeMilli;
            diff = ~~(diff / 1000);
            if (diff < 60) {
                return diff + '초 전';
            }
            diff = ~~(diff / 60);
            if (diff < 60) {
                return diff + '분 전';
            }
            diff = ~~(diff / 60);
            if (diff < 24) {
                return diff + '시간 전';
            }
            diff = ~~(diff / 24);
            if (diff < 30) {
                return diff + '일 전';
            }
            return new Date(renderTimeMilli).toLocaleDateString();
        }

        for (let time of root.querySelectorAll('span.timeago')) {
            const date = Date.parse(time.title + "+0900");
            time.innerHTML = toString(date);
        }
    }

    const updateTimeRepeat = function() {
        updateTime(document);
        setTimeout(updateTimeRepeat, 5000);
    }

    updateTimeRepeat();

    const bodyCallback = function(mutations, observer) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    updateTime(node);
                }
            }
        }
    };

    const observer = new MutationObserver(bodyCallback);
    observer.observe(document.body, { subtree: true, childList: true });
})();
