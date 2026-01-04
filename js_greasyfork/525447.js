// ==UserScript==
// @name         Edio Countdowns
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      CC BY-NC
// @description  Countdowns look just a bit better..
// @author       Unknown Hacker
// @match        https://www.myedio.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525447/Edio%20Countdowns.user.js
// @updateURL https://update.greasyfork.org/scripts/525447/Edio%20Countdowns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = null;
    let trackingData = {};

    function formatTimeToHHMMAMPM(timestamp) {
        let date = new Date(timestamp);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    function updateTimeFromSpan() {
        let spans = document.querySelectorAll("span:not([data-time-start])");

        spans.forEach(span => {
            let match = span.textContent.match(/(\d+)\s*min/);
            if (match) {
                let minutes = parseInt(match[1], 10);
                let now = new Date();
                let targetTime = new Date(now.getTime() + minutes * 60000);

                span.setAttribute("data-time-start", targetTime.getTime());
                span.setAttribute("data-start-time", now.toISOString());

                trackingData[span] = { targetTime, startTime: now.getTime() };
            }
        });
    }

    function updateCountdown() {
        let spans = document.querySelectorAll("span[data-time-start]");

        spans.forEach(span => {
            let now = new Date().getTime();
            let diff = Math.floor((trackingData[span].targetTime - now) / 1000);

            let text;
            if (diff > 0) {
                let minutesLeft = Math.floor(diff / 60);
                let secondsLeft = diff % 60;
                text = `Starts in ${minutesLeft}min ${secondsLeft}secs`;
            } else {
                let elapsed = Math.abs(diff);
                let minutesAgo = Math.floor(elapsed / 60);
                let secondsAgo = elapsed % 60;
                text = `Started ${minutesAgo}min ${secondsAgo}secs ago`;
            }

            span.setAttribute("data-text", text);
            span.textContent = text;
        });
    }

    function addHoverEffect() {
        let spans = document.querySelectorAll("span[data-text]");

        spans.forEach(span => {
            span.addEventListener("mouseenter", () => {
                clearInterval(intervalId);
                intervalId = null;

                let targetTime = trackingData[span].targetTime;
                let formattedTargetTime = formatTimeToHHMMAMPM(targetTime);

                span.textContent = `Hovering: ${formattedTargetTime}`;
            });

            span.addEventListener("mouseleave", () => {
                updateCountdown();
                if (!intervalId) {
                    intervalId = setInterval(updateCountdown, 1000);
                }
            });
        });
    }

    updateTimeFromSpan();
    updateCountdown();
    addHoverEffect();

    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                updateTimeFromSpan();
                addHoverEffect();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    intervalId = setInterval(updateCountdown, 1000);
})();