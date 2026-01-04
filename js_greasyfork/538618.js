// ==UserScript==
// @name         VDP Current Event Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlights VDP Current Event in blue
// @author       aakpooni
// @match        https://kdpow.amazon.com/work/vdp/baseline/*
// @match        https://crisp.amazon.com/details/*
// @match        https://kdpow.amazon.com/work/pv/baseline/*
// @grant        aakpooni
// @downloadURL https://update.greasyfork.org/scripts/538618/VDP%20Current%20Event%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/538618/VDP%20Current%20Event%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to highlight VDP Current Event
    function highlightVDPEvent() {
        // Find the th element containing "VDP Current Event"
        const vdpElements = document.querySelectorAll('th');
        vdpElements.forEach(element => {
            if (element.textContent.trim() === 'VDP Current Event') {
                // Add background color to the th element
                element.style.backgroundColor = '#0000FF';
                element.style.color = 'white';
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', highlightVDPEvent);

    // Also run the function periodically in case of dynamic content loading
    setInterval(highlightVDPEvent, 2000);
})();
