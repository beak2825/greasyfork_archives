// ==UserScript==
// @name         Degrees of Lewdity
// @namespace    lander_scripts
// @version      1.70
// @description  Binds Left and Right keys do forward and Back in story, F4 and F8 to quick save and quick load, warns about broken chastity belt
// @author       You
// @match        file:///*/Degrees%20of%20Lewdity/*
// @icon         https://static.wikitide.net/degreesoflewditywiki/6/64/Favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534011/Degrees%20of%20Lewdity.user.js
// @updateURL https://update.greasyfork.org/scripts/534011/Degrees%20of%20Lewdity.meta.js
// ==/UserScript==


console.info('💗 Degrees of Lewdity: Script Loaded');

(function () {
    'use strict';

    /**
    * Warns if chastity broke
    * Shows feedback 'Game Saved (F4)' when fitting.
    */

    function checkForChastityBeltBreak() {
        const passageContent = document.querySelector('.passage'); // Get current passage

        if (passageContent) {
            // Find all spans in the current passage
            const spans = passageContent.querySelectorAll('span');

            // Iterate over each span
            spans.forEach(span => {
                // If span's text contains the target text
                if (span.textContent.includes("Your chastity belt breaks")) {
                    span.classList.add('chastityBroke'); // Add class
                    alert("Your chastity belt broke.");
                }
            });
        }
    }

    // Set up MutationObserver
    const targetNode = document.getElementById('story'); // Observe #story div

    if (targetNode) {
        const config = { childList: true, subtree: true }; // Watch all content changes

        const observer = new MutationObserver(function(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    checkForChastityBeltBreak(); // Run check on new content
                }
            }
        });

        observer.observe(targetNode, config); // Start observing

        checkForChastityBeltBreak(); // Initial check on load
    } else {
        console.error("[Chastity Alert] Could not find '#story' element."); // Error if not found
    }

    /**
    * BINDS KEYS TO QUICKSAVE AND QUICKLOAD
    * Shows feedback 'Game Saved (F4)' when fitting.
    */

    const keyBindings = {
        'F4': '#saves-list-container .savesListRow:nth-child(3) .saveMenuButton:first-of-type',
        'F8': '#saves-list-container .savesListRow:nth-child(3) .saveMenuButton:last-of-type'
    };

    function ensureSidebarActive() {
        const sidebarBtn = document.querySelector('.sidebarButtonSplit:last-of-type > :last-child');
        if (sidebarBtn) sidebarBtn.click();
    }

    function showFeedback(text = '✔ Action triggered') {
        const msg = document.createElement('div');
        msg.textContent = text;
        Object.assign(msg.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#333',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '5px',
            fontSize: '14px',
            zIndex: 9999,
            opacity: 0,
            transition: 'opacity 0.3s'
        });

        document.body.appendChild(msg);
        // Trigger fade-in
        requestAnimationFrame(() => msg.style.opacity = 1);
        // Remove after 1.5s
        setTimeout(() => {
            msg.style.opacity = 0;
            setTimeout(() => msg.remove(), 300);
        }, 1500);
    }

    document.addEventListener('keydown', function (event) {
        if (event.altKey) return;

        const selector = keyBindings[event.key];
        if (!selector) return;

        event.preventDefault();

        if (event.key === 'F8') {
            ensureSidebarActive();
            setTimeout(() => {
                const btn = document.querySelector(selector);
                if (btn) {
                    btn.click();
                    showFeedback('📲 Game Loaded (F8)');
                }
            }, 200);
        } else {
                        ensureSidebarActive();
            setTimeout(() => {
                const btn = document.querySelector(selector);
                if (btn) {
                    btn.click();
                    showFeedback('💾 Game Saved (F4)');
                }
            }, 200);
        }
    });

    /**
    * BINDS KEYS TO BACK AND FORWARD
    * Check if the user is currently typing in a context
    * like an <input>, <textarea>, or a contenteditable element.
    * This prevents accidental navigation while writing text.
    */
    function isTypingContext() {
        const active = document.activeElement;
        return (
            active.tagName === 'INPUT' ||           // Standard input field
            active.tagName === 'TEXTAREA' ||        // Multiline input
            active.isContentEditable                // Any rich text editor or div[contenteditable]
        );
    }

    // Listen for keydown events across the entire document
    document.addEventListener('keydown', function (event) {

        // Exit early if user is typing in an input or text area
        if (isTypingContext()) return;

        // If the Left Arrow key is pressed
        if (event.key === 'ArrowLeft') {
            // Try to find the element with ID 'history-backward'
            const back = document.getElementById('history-backward');
            if (back) back.click(); // Simulate a click if the element exists
        }

        // If the Right Arrow key is pressed
        else if (event.key === 'ArrowRight') {
            // Try to find the element with ID 'history-forward'
            const forward = document.getElementById('history-forward');
            if (forward) forward.click(); // Simulate a click if the element exists
        }
    }, false);
})();