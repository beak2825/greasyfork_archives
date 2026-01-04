// ==UserScript==
// @name         Diep.io Center Dot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a small black dot to the center of the screen in Diep.io, so you can understand where you are exactly when you invisible, like on Landmine, Manager or Stalker, i created this script because i am confused where i am when invisible.
// @author       DERONIX
// @license MIT
// @match        https://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471054/Diepio%20Center%20Dot.user.js
// @updateURL https://update.greasyfork.org/scripts/471054/Diepio%20Center%20Dot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dotSize = 5; // Adjust the size of the dot here

    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.width = `${dotSize}px`;
    dot.style.height = `${dotSize}px`;
    dot.style.background = 'black';
    dot.style.borderRadius = '50%';
    dot.style.zIndex = '9999';
    document.body.appendChild(dot);

    let isVisible = true;

    function toggleDotVisibility() {
        isVisible = !isVisible;
        dot.style.display = isVisible ? 'block' : 'none';
    }

    function updateDotPosition() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        dot.style.left = `${centerX - dotSize / 2}px`;
        dot.style.top = `${centerY - dotSize / 2}px`;
    }

    function handleKeyPress(event) {
        // Check if the pressed key is 'M'
        if (event.key === 'M' || event.key === 'm') {
            toggleDotVisibility();
        }
    }

    window.addEventListener('resize', updateDotPosition);
    window.addEventListener('keydown', handleKeyPress);
    updateDotPosition();
})();
