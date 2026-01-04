// ==UserScript==
// @name         Smooth Auto-Scroll with 4 Speeds and Hotkey
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Smooth auto-scroll with 4 speed options, 2-second delay, and hotkey (Ctrl+Shift+S to stop). Ideal for recording or fast previewing pages.
// @author       Xenon
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/539136/Smooth%20Auto-Scroll%20with%204%20Speeds%20and%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/539136/Smooth%20Auto-Scroll%20with%204%20Speeds%20and%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrolling = false;
    let scrollInterval = null;

    const speeds = {
        slow:   { px: 1, interval: 20 },
        medium: { px: 12, interval: 15 },
        fast:   { px: 24, interval: 15 },
        faster: { px: 96, interval: 15 }
    };

    function startAutoScroll(speedKey) {
        if (scrolling) return;

        scrolling = true;
        alert(`Auto-scroll (${speedKey.toUpperCase()}) will start in 2 seconds. Press Ctrl+Shift+S to stop.`);

        setTimeout(() => {
            const speed = speeds[speedKey];
            scrollInterval = setInterval(() => {
                window.scrollBy({ top: speed.px, left: 0, behavior: 'smooth' });
            }, speed.interval);
        }, 2000); // 2 second delay before scrolling starts
    }

    function stopAutoScroll() {
        if (scrolling) {
            clearInterval(scrollInterval);
            scrolling = false;
            alert('Auto-scroll stopped.');
        }
    }

    // Tampermonkey Menu Options
    GM_registerMenuCommand('Start Auto-Scroll (Slow)',   () => startAutoScroll('slow'));
    GM_registerMenuCommand('Start Auto-Scroll (Medium)', () => startAutoScroll('medium'));
    GM_registerMenuCommand('Start Auto-Scroll (Fast)',   () => startAutoScroll('fast'));
    GM_registerMenuCommand('Start Auto-Scroll (Faster)', () => startAutoScroll('faster'));
    GM_registerMenuCommand('Stop Auto-Scroll', stopAutoScroll);

    // Hotkey: Ctrl + Shift + S to stop scrolling
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            stopAutoScroll();
        }
    });

})();
