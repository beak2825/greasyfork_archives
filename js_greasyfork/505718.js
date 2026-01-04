// ==UserScript==
// @name Hide Unsafe Direct Download Links
// @namespace    yyyzzz999
// @author       yyyzzz999
// @description  10/28/25 Hide Unsafe Direct Download Links
// @match        https://www.myanonamouse.net/tor/browse.php*
// @match        https://www.myanonamouse.net/index.php
// @match        https://www.myanonamouse.net/
// @version      3
// @icon         https://www.myanonamouse.net/pic/smilies/MoreSmilies/jumping-smiley-002.gif
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/505718/Hide%20Unsafe%20Direct%20Download%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/505718/Hide%20Unsafe%20Direct%20Download%20Links.meta.js
// ==/UserScript==
/*jshint esversion: 11 */
/*eslint no-multi-spaces:0 */

//TODO: Add a reminder near UTC midnight that some VIP or Site FL torrents may expire soon!

// Constants
var DEBUG = 0; // Verbose debugging mode on (1) or off (0)
const TblWait = 1500; // Timeout for table loading and processing
const SanityWindow = 800; // Sanity window in milliseconds avoids multiple table modifications

// Global variables
var modifyCount = 0;
var lastModifyTimestamp = null;
var lastProcessingTimestamp = null;

if (DEBUG > 0) console.log('Starting Hide Unsafe Direct Download Links');

// Blink potentially expiring VIP expires torrents if search loaded in the half hour before midnight UTC
    // 1. Get the current time in UTC
    const now = new Date();

    // 2. Determine the target time: 30 minutes before UTC Midnight
    // We calculate midnight UTC *tomorrow* and subtract the window,
    // or calculate midnight *today* and check if 'now' is within the window.

    // 2. Determine the start of the 30-minute window: 23:30:00 UTC today
    var windowStartTime = new Date(now);
    windowStartTime.setUTCHours(23, 30, 0, 0);

    // If the current time is BEFORE 23:30 UTC, the script should wait for that time.
    // However, if the current time is 23:50 UTC, it *is* within the window.
    const isWithinWindow = now.getTime() >= windowStartTime.getTime();

    if (DEBUG) console.log("Current UTC time: ", now.toUTCString());
    if (DEBUG) console.log("Window Start (23:30 UTC today): ", windowStartTime.toUTCString());
    if (DEBUG) console.log("Is within 30-min window? ", isWithinWindow);

    if (isWithinWindow) { // Swap isWithinWindow with 1 or true to always see expiring VIP images blink
        if (DEBUG) console.log("✅ The current time is within 30 minutes of midnight UTC. Starting blink sequence.");

        // --- Blinking Logic ---

    // --- WRAP THE BLINKING LOGIC IN A TIMEOUT ---
        setTimeout(() => {
            if (DEBUG) console.log("🕒 2-second delay elapsed. Starting image selection and blink.");

            // Use a CSS selector to find all images with alt tags starting with "VIP expires "
            const targetImages = document.querySelectorAll('img[alt^="VIP expires "]');

            if (DEBUG) console.log(`Found ${targetImages.length} target images.`);

            if (targetImages.length > 0) {
                // A simple blink function using opacity
                const blink = (element) => {
                    let isVisible = true;
                    // Store the interval ID so we can stop it later if needed
                    element.blinkIntervalId = setInterval(() => {
                        element.style.opacity = isVisible ? '0' : '1';
                        isVisible = !isVisible;
                    }, 500); // Blinks every 500ms (twice a second)
                };

                // Apply the blink effect to all found images
                targetImages.forEach(img => {
                    // Ensure the image can be manipulated and is visible
                    img.style.transition = 'opacity 0.5s ease-in-out';
                    blink(img);
                });
            } else {
                 if (DEBUG) console.log("❌ Found 0 target images after the 2-second delay.");
            }
        }, 2000); // 2000 milliseconds = 2 seconds
    } else {
        if (DEBUG) console.log("❌ Not yet within 30 minutes of midnight UTC. Blinking skipped.");
    }
// End Blink potentially expiring VIP expires images v3

// Function to modify the table
function modifyTable(table) {
    const now = Date.now();

    if (lastProcessingTimestamp && now - lastProcessingTimestamp < SanityWindow) {
        if (DEBUG > 0) {
            console.log(`[DEBUG] Skipping modifyTable - still within SanityWindow (${now - lastProcessingTimestamp}ms)`);
        }
        return; // Sanity check: Don't process if still within the wait time
    }

    lastProcessingTimestamp = now;

    if (DEBUG > 0) {
        console.log(`[DEBUG] Calling modifyTable at: ${now}`);
    }

    console.log('Modifying table:', table);
    const rows = table.querySelectorAll('tr:nth-child(n+2)');
    rows.forEach((row, index) => {
        const col2 = row.cells[1];
        const col4 = row.cells[3];
        if (!col2 || !col4) return;

        const hasValidImage = col2.querySelector('img[alt^="VIP"], img[alt="freeleech"]'); //Now match any alt tag starting with VIP for new VIP expires tag!
        const hasValidSpan = Array.from(col2.querySelectorAll('span')).some(span => span.textContent.trim() === "PF");

        if (!hasValidImage && !hasValidSpan) {
            const links = col4.querySelectorAll('a[title="Direct Download"]');
            links.forEach(link => {
                link.remove();
            });
        }
    });

    modifyCount++;
    lastModifyTimestamp = now;

    if (DEBUG > 0) {
        console.log(`[DEBUG] Modified at: ${lastModifyTimestamp}`);
    }
}

// Initial table modification
setTimeout(() => {
    const table = document.querySelector('table.newTorTable');
    if (table) {
        //console.log('Starting Hide Unsafe Direct Download Links');
        modifyTable(table);
		if (DEBUG > 0) console.log('Hide Unsafe Direct Download Links removed fist batch');

    } else {
        console.log('Table not found. Skipping modification.');
    }
}, TblWait);

// Mutation Observer
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        // Check if any added nodes are tables with the class 'newTorTable'
        const newTables = Array.from(mutation.addedNodes).filter(node => node.nodeType === Node.ELEMENT_NODE && node.classList.contains('newTorTable'));

        for (const newTable of newTables) {
            if (DEBUG > 0) {
                console.log(`[DEBUG] Mutation Observer detected new table: ${newTable}`);
            }
            setTimeout(() => {
                modifyTable(newTable);
            }, TblWait);
        }
    }
});

const parentElement = document.getElementById('ssr');
if (parentElement) {
    const config = { childList: true, subtree: true };
    observer.observe(parentElement, config);
} else {
    console.log('Parent element with ID "ssr" not found.');
}