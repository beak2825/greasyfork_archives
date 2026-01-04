// ==UserScript==
// @name         Udio Free Credits
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically submits timed keystrokes to activate/listen to the examples on the feedback page, submit a vote on example A, and proceeding to the next.
// @author       nattuggla
// @license      GPL3
// @match        https://www.udio.com/feedback
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/514346/Udio%20Free%20Credits.user.js
// @updateURL https://update.greasyfork.org/scripts/514346/Udio%20Free%20Credits.meta.js
// ==/UserScript==

(function() {
    'use strict';

// README:
// It seems that you usually need to activate Udios page manually first by clicking/start playing the example A via clicking the button. Then the script should play like an automatic piano until you change url.
// Script has a few buffer seconds added, to wait for any potential load times depending on the users connection. Feel free to edit below to shave off a few seconds if you want.

async function executeSequence() {
    try {
        // Wait for page to be fully loaded
        await waitForPageLoad();

        while (true) {
            // Send space keystroke
            simulateKeyPress(' ');
            console.log('Space key pressed');

            // Wait 11 seconds
            await sleep(11000);

            // Send right arrow keystroke
            simulateKeyPress('ArrowRight');
            console.log('Right arrow key pressed');

            // Wait 11 seconds
            await sleep(11000);

            // Try to click the button
            const buttonClicked = await tryClickButton();

            // If button click failed, send 'A' keystroke
            if (!buttonClicked) {
                simulateKeyPress('A');
                console.log('A key pressed (fallback)');
            }

            // Wait 3 seconds before restarting
            await sleep(3000);
        }
    } catch (error) {
        console.error('Error in sequence execution:', error);
    }
}

// Helper function to wait for page load
function waitForPageLoad() {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });
}

// Helper function for sleeping/waiting
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to simulate keyboard events
function simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', {
        key: key,
        code: key === ' ' ? 'Space' : key,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

// Helper function to try clicking the button
async function tryClickButton() {
    try {
        const buttonSelector = '.rounded-lg.border.text-card-foreground.shadow-sm.flex.gap-8.bg-gray-medium.p-8.md\\:gap-28 > div.flex.flex-col.items-center:nth-of-type(1) > .mt-8 > .inline-flex.items-center.justify-center.whitespace-nowrap.text-sm.font-medium.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.border-\\[0\\.5px\\].border-white\\/10.bg-white\\/5.text-white.hover\\:bg-secondary\\/80.h-10.rounded-md.px-4.py-2.mx-auto.w-fit';
        const button = document.querySelector(buttonSelector);

        if (button) {
            button.click();
            console.log('Button clicked successfully');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error clicking button:', error);
        return false;
    }
}

// Start the sequence
executeSequence();
    })();
