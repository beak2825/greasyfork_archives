// ==UserScript==
// @name         Enhanced Scroll Position Cycler
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @author       Rekt
// @description  Cycle through recent scroll positions with enhanced functionality
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520527/Enhanced%20Scroll%20Position%20Cycler.user.js
// @updateURL https://update.greasyfork.org/scripts/520527/Enhanced%20Scroll%20Position%20Cycler.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let scrollPositions = [];
    let currentIndex = -1;
    let isSwitching = false;
    let switchStartTime = 0;
    let lastSwitchTime = 0;

    // Timing constants based on human reaction research
    const FAST_SWITCH_THRESHOLD = 180; // Visual reaction threshold[6]
    const POSITION_THRESHOLD = 250;    // Average reaction time[2][7]
    let positionTimer = null;

    function addPositionToList(position) {
        let index = scrollPositions.findIndex(p => Math.abs(p.y - position.y) < 50);
        if (index !== -1) {
            scrollPositions.splice(index, 1);
        }
        scrollPositions.unshift(position);
        if (scrollPositions.length > 10) {
            scrollPositions.pop();
        }
    }

    function recordScrollPosition() {
        clearTimeout(positionTimer);
        positionTimer = setTimeout(() => {
            let position = { y: window.pageYOffset };
            addPositionToList(position);
        }, POSITION_THRESHOLD);
    }

    function scrollToPosition(position) {
        window.scrollTo({
            top: position.y,
            behavior: 'smooth'
        });
    }

    function cycleScrollPositions(event) {
        if (event.altKey && event.key === 'c') {
            event.preventDefault();

            let now = Date.now();
            if (!isSwitching) {
                isSwitching = true;
                switchStartTime = now;
                currentIndex = 0;
            } else {
                currentIndex = (currentIndex + 1) % scrollPositions.length;
            }

            if (now - lastSwitchTime > FAST_SWITCH_THRESHOLD) {
                // Slow switch: only use the last two positions
                let lastTwo = scrollPositions.slice(0, 2);
                currentIndex = currentIndex % 2;
                scrollToPosition(lastTwo[currentIndex]);
            } else {
                // Fast switch: use all positions
                scrollToPosition(scrollPositions[currentIndex]);
            }

            lastSwitchTime = now;
        }
    }

    function endSwitching() {
        if (isSwitching) {
            isSwitching = false;
            let currentPosition = scrollPositions[currentIndex];
            scrollPositions = [currentPosition, ...scrollPositions.filter(p => p !== currentPosition)];
        }
    }

    function registerTopPosition() {
        let topPosition = { y: 0 };
        addPositionToList(topPosition);
    }

    // Register top position on page load
    registerTopPosition();

    window.addEventListener('scroll', recordScrollPosition);
    window.addEventListener('keydown', cycleScrollPositions);
    window.addEventListener('keyup', event => {
        if (event.key === 'Alt') {
            endSwitching();
        }
    });
})();