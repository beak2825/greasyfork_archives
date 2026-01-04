// ==UserScript==
// @name         Remove Chat from Streamed.su
// @namespace    https://x.com/officebeats
// @version      0.12
// @description  Removes the live chat and "Enter theater mode" button from streamed.su streaming pages, centering the video content
// @author       oB3ATS
// @match        https://streamed.su/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528588/Remove%20Chat%20from%20Streamedsu.user.js
// @updateURL https://update.greasyfork.org/scripts/528588/Remove%20Chat%20from%20Streamedsu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Remove Chat from Streamed.su v0.12 started on', window.location.href);

    // Inject CSS to center the video and stream links
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Center the flex container after chat removal */
            .w-full.h-screen.flex {
                justify-content: center;
            }
            /* Ensure video container stays responsive and centered */
            .md\\:w-3\\/4.transition-transform {
                width: auto;
                max-width: 75%;
                margin: 0 auto;
            }
            /* Center the iframe within its container */
            iframe.w-full.h-fit.aspect-video {
                display: block;
                margin: 0 auto;
            }
        `;
        document.head.appendChild(style);
        console.log('CSS injected to center video and stream links');
    }

    // Function to remove chat elements
    function removeChat() {
        let chatElement = document.querySelector('div[class="md:w-1/4 h-full flex flex-col gap-2 transition-all translate-x-0"]');
        if (chatElement) {
            console.log('Found chat with exact class match:', chatElement);
            chatElement.remove();
            return true;
        }

        chatElement = document.querySelector('div[class*="md:w-1/4"][class*="h-full"][class*="flex"]');
        if (chatElement) {
            console.log('Found chat with partial class match:', chatElement);
            chatElement.remove();
            return true;
        }

        console.log('Chat not found at this time');
        return false;
    }

    // Function to remove "Enter theater mode" button
    function removeTheaterModeButton() {
        let button = document.querySelector('button.ring-offset-background.inline-flex.w-full.mt-2');
        if (button && button.textContent.trim() === 'Enter theater mode') {
            console.log('Found "Enter theater mode" button:', button);
            button.remove(); // Remove only the button, not the parent div
            return true;
        }

        console.log('Theater mode button not found at this time');
        return false;
    }

    // Delayed execution to avoid SvelteKit rendering conflicts
    setTimeout(() => {
        // Inject CSS first
        injectCSS();

        // Initial removal attempts
        let chatRemoved = removeChat();
        let buttonRemoved = removeTheaterModeButton();
        if (chatRemoved) console.log('Chat removed immediately');
        else console.log('Chat not found initially');
        if (buttonRemoved) console.log('Theater mode button removed immediately');
        else console.log('Theater mode button not found initially, setting up observer');

        // Persistent MutationObserver to catch dynamic additions
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    console.log('DOM nodes added, checking for elements');
                    if (removeChat()) console.log('Chat removed after DOM update');
                    if (removeTheaterModeButton()) console.log('Theater mode button removed after DOM update');
                }
            });
        });

        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });

        // Fallback interval check
        const checkInterval = setInterval(() => {
            let chatSuccess = removeChat();
            let buttonSuccess = removeTheaterModeButton();
            if (chatSuccess && buttonSuccess) {
                clearInterval(checkInterval);
                console.log('Both chat and theater mode button removed, stopping checks');
            }
        }, 1000);

        window.addEventListener('unload', () => {
            observer.disconnect();
            clearInterval(checkInterval);
            console.log('Script cleanup on page unload');
        });
    }, 1000); // 1-second delay to allow SvelteKit rendering

    // Log errors for debugging
    window.addEventListener('error', (e) => {
        console.log('Page error detected:', e.message);
    });
})();