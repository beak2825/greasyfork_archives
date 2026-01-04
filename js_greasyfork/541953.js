// ==UserScript==
// @name        Open current page in Gemini and summarize. with moveable Button v1.0
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Adds a smaller, draggable button to all web pages that opens Gemini with a prompt to summarize the current page.
// @author      Gemini (Modified)
// @license MIT
// @match       *://*/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/541953/Open%20current%20page%20in%20Gemini%20and%20summarize%20with%20moveable%20Button%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/541953/Open%20current%20page%20in%20Gemini%20and%20summarize%20with%20moveable%20Button%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Link to Gemini Button script (v2.4) is loading.");
    if (typeof GM_info !== 'undefined') {
        console.log("GM_info:", GM_info);
    } else {
        console.log("GM_info is not available. Script might not be running in a UserScript manager.");
    }

    const BUTTON_ID = 'gemini-button-draggable';
    const POSITION_KEY_X = 'geminiButtonPosX';
    const POSITION_KEY_Y = 'geminiButtonPosY';

    // --- Styling for the button ---
    GM_addStyle(`
        #${BUTTON_ID} {
            position: fixed;
            background-color: #4285F4; /* Google Blue */
            color: white;
            border: none;
            padding: 5px 10px; /* Smaller padding */
            border-radius: 3px; /* Slightly less rounded */
            cursor: grab; /* Indicate it's draggable */
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 12px; /* Smaller font size */
            font-weight: bold;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* Smaller shadow */
            transition: background-color 0.2s ease, box-shadow 0.2s ease;
            min-width: unset; /* Ensure no conflicting min-width */
            line-height: normal; /* Ensure text fits */
            text-align: center;
        }
        #${BUTTON_ID}:hover {
            background-color: #3367D6; /* Darker blue on hover */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        #${BUTTON_ID}.copied {
            background-color: #28a745; /* Green when copied */
        }
        #${BUTTON_ID}.dragging {
            cursor: grabbing;
            box-shadow: 0 0 0 2px #DB4437; /* Red outline when dragging */
        }
    `);

    // --- Function to create and add the button ---
    async function addGeminiButton() {
        console.log("Attempting to add Gemini button...");

        // Prevent adding multiple buttons
        if (document.getElementById(BUTTON_ID)) {
            console.log("Gemini button already exists. Skipping re-creation.");
            return;
        }

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.className = 'gemini-button';
        button.textContent = 'Open Gemini'; // More general text

        // --- Load saved position ---
        const savedX = await GM_getValue(POSITION_KEY_X, null);
        const savedY = await GM_getValue(POSITION_KEY_Y, null);

        if (savedX !== null && savedY !== null) {
            button.style.left = savedX + 'px';
            button.style.top = savedY + 'px';
            button.style.right = 'unset'; // Clear right if left is set
            button.style.bottom = 'unset'; // Clear bottom if top is set
        } else {
            // Default position if no saved position
            button.style.right = '20px';
            button.style.top = '100px';
        }

        // --- Draggable Logic ---
        let isDragging = false;
        let offsetX, offsetY;
        let lastClickX, lastClickY; // To detect if a drag happened vs. a click

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            button.classList.add('dragging');
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            lastClickX = e.clientX;
            lastClickY = e.clientY;
            button.style.userSelect = 'none'; // Prevent text selection during drag
            e.preventDefault(); // Prevent default drag behavior (e.g., image drag)
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            // Clear right/bottom styles as we're setting left/top
            button.style.right = 'unset';
            button.style.bottom = 'unset';
            button.style.left = (e.clientX - offsetX) + 'px';
            button.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', async (e) => {
            if (!isDragging) return;
            isDragging = false;
            button.classList.remove('dragging');
            button.style.userSelect = 'auto'; // Restore user-select

            // Save new position
            const finalX = button.getBoundingClientRect().left;
            const finalY = button.getBoundingClientRect().top;
            await GM_setValue(POSITION_KEY_X, finalX);
            await GM_setValue(POSITION_KEY_Y, finalY);
            console.log(`Saved button position: X=${finalX}, Y=${finalY}`);

            // If a significant drag occurred, prevent the click event from firing
            const dx = Math.abs(e.clientX - lastClickX);
            const dy = Math.abs(e.clientY - lastClickY);
            if (dx > 5 || dy > 5) {
                console.log("Mouse up after drag, preventing click.");
                e.stopImmediatePropagation(); // Prevent subsequent click event on the button
            }
        });

        // --- Button Click Logic ---
        button.addEventListener('click', async () => {
            const currentUrl = window.location.href;
            const textToCopy = `Summarize this page: ${currentUrl}`; // The prompt text

            try {
                // Use GM_setClipboard if available. We don't need a fallback since we are not displaying the "Copied!" message based on clipboard success anymore.
                if (typeof GM_setClipboard === 'function') {
                    GM_setClipboard(textToCopy);
                    console.log("Prompt copied to clipboard using GM_setClipboard:", textToCopy);
                }

                // Open Gemini in a new tab with the desired URL structure
                // ***************************************************************
                // ** THIS IS THE MODIFIED LINE TO MATCH YOUR REQUESTED SYNTAX **
                // ***************************************************************
                const geminiUrl = `https://gemini.google.com/app/54299f6f7b8a6a75?q=${encodeURIComponent(textToCopy)}`;
                window.open(geminiUrl, '_blank');
                console.log("Opening Gemini tab:", geminiUrl);

                // Flash a confirmation on the button
                button.textContent = 'Opened!';
                button.classList.add('copied'); // Using 'copied' class for green color

                // Revert button text after a delay
                setTimeout(() => {
                    button.textContent = 'Open Gemini';
                    button.classList.remove('copied');
                }, 2000);

            } catch (error) {
                console.error('Failed to perform action:', error);
                button.textContent = 'Error!';
                button.style.backgroundColor = 'red';
                setTimeout(() => {
                    button.textContent = 'Open Gemini';
                    button.style.backgroundColor = '#4285F4'; // Revert to Google Blue
                }, 2000);
                alert("Failed to open Gemini. Check browser console (F12) for details.");
            }
        });

        // Append the button to the body
        if (document.body) {
            document.body.appendChild(button);
            console.log("Gemini button successfully added to the page.");
        } else {
            console.error("Document body not found. Could not add Gemini button.");
            // If body isn't ready yet, try again after a short delay
            setTimeout(addGeminiButton, 100);
        }
    }

    // Run the main logic after the window has fully loaded
    window.addEventListener('load', addGeminiButton);
    // Also run on DOMContentLoaded for faster injection on some pages
    window.addEventListener('DOMContentLoaded', addGeminiButton);

})();