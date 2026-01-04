// ==UserScript==
// @name         Dzen Auto Expander (Comments & More) v1.2 (MutationObserver)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Автоматически разворачивает ветки комментариев Dzen, нажимает «читать дальше» в комментариях и нажимает главную кнопку «показать больше комментариев».
// @author       Your Name Here (Updated)
// @match        *://dzen.ru/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532684/Dzen%20Auto%20Expander%20%28Comments%20%20More%29%20v12%20%28MutationObserver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532684/Dzen%20Auto%20Expander%20%28Comments%20%20More%29%20v12%20%28MutationObserver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBOUNCE_DELAY_MS = 500; // Wait 500ms after the last DOM change before running checks
    const INITIAL_DELAY_MS = 2000; // Wait 2 seconds after page idle before initial check and starting observer

    let debounceTimer = null;
    let observer = null;
    let stopped = false;
    let runCount = 0; // Counter for logging purposes

    // --- Selectors ---
    const SELECTORS = {
        expandReplies: '.comments2--root-comment__btnWithSpinner-jK > button[aria-label^="Показать"]',
        expandLongComment: '.comments2--rich-text-clamp__isInteractive-1s span.comments2--rich-text__expandWord-2_',
        loadMoreRootComments: 'button[data-gvdytw8xp="show-more-comments"][aria-label="Показать ещё"]'
    };

    function clickElement(element, elementType) {
        if (element && typeof element.click === 'function' && element.offsetParent !== null) {
            // Check if the element is actually visible in the viewport (optional but good practice)
            // This check might be too strict sometimes if elements are clickable just outside the viewport
            // const rect = element.getBoundingClientRect();
            // const isVisible = rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
            // if (!isVisible) return false; // Skip if not strictly visible

            console.log(`[Dzen Expander] Clicking ${elementType}:`, element);
            try {
                 element.click();
                 return true; // Click attempt successful
            } catch (e) {
                 console.error(`[Dzen Expander] Error clicking ${elementType}:`, e, element);
                 return false; // Click failed
            }
        }
        return false; // Element not found, not clickable, or not visible
    }

    function runExpansionCycle() {
        if (stopped) return;
        runCount++;
        console.log(`[Dzen Expander] Running check cycle #${runCount}...`);

        let actionPerformed = false;

        // 1. Expand long comment texts ("ещё")
        // Query all each time as new ones might appear. Click all found ones.
        document.querySelectorAll(SELECTORS.expandLongComment).forEach(element => {
            // Check visibility again before clicking
            if (element.offsetParent !== null) {
                 if (clickElement(element, "long comment 'ещё'")) {
                     actionPerformed = true;
                 }
            }
        });

        // 2. Expand replies ("Показать еще X ответов")
        // Click only *one* reply button per cycle to allow DOM to update smoothly.
        const replyButton = document.querySelector(SELECTORS.expandReplies);
        if (replyButton) {
            if (clickElement(replyButton, "expand replies button")) {
                actionPerformed = true;
            }
        }

        // 3. Load more root comments ("Показать ещё")
        // Click only if it exists and wasn't handled above (though selectors are distinct)
        const loadMoreButton = document.querySelector(SELECTORS.loadMoreRootComments);
        if (loadMoreButton && !actionPerformed) { // Prioritize expanding existing comments over loading new ones in the same cycle
            if (clickElement(loadMoreButton, "load more comments button")) {
                actionPerformed = true;
            }
        }

        if (!actionPerformed) {
             console.log(`[Dzen Expander] Cycle #${runCount}: No expandable elements found this time.`);
        } else {
             console.log(`[Dzen Expander] Cycle #${runCount}: Action performed. Observer will trigger next check if needed.`);
             // We might want to immediately queue another check if an action was performed,
             // as clicking one button might reveal another immediately. The debounce handles this.
        }
    }

    // --- MutationObserver Callback ---
    // This function is called when the DOM changes. It uses a debounce mechanism.
    const mutationCallback = (mutationsList, obs) => {
        if (stopped) return;

        // We don't need to inspect mutationsList in detail. Any relevant change
        // might add new comments or buttons anywhere. Just trigger a debounced check.
        // console.log('[Dzen Expander] DOM Mutation detected.'); // Optional: Can be noisy

        // Clear the previous timer if it exists
        clearTimeout(debounceTimer);

        // Set a new timer to run the check after a short delay
        debounceTimer = setTimeout(() => {
             runExpansionCycle();
        }, DEBOUNCE_DELAY_MS);
    };

    function stopScript(reason) {
        if (stopped) return; // Already stopped
        stopped = true;
        clearTimeout(debounceTimer); // Clear any pending debounced check
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log("[Dzen Expander] MutationObserver disconnected.");
        }
        console.log(`[Dzen Expander] Script stopped. Reason: ${reason}`);
    }

    // --- Initialization ---
    console.log("[Dzen Expander] Script loaded. Waiting for page idle...");

    // Use setTimeout to delay the start slightly after document idle
    setTimeout(() => {
        if (stopped) return; // Check if manually stopped before starting

        console.log("[Dzen Expander] Performing initial expansion check...");
        try {
            runExpansionCycle(); // Run one initial check immediately
        } catch (e) {
            console.error("[Dzen Expander] Error during initial run:", e);
        }


        console.log("[Dzen Expander] Setting up MutationObserver...");
        // Create an observer instance linked to the callback function
        observer = new MutationObserver(mutationCallback);

        // Start observing the entire document body for added/removed nodes and subtree changes
        // This is broad but necessary for dynamic content loading like comments
        observer.observe(document.body, {
            childList: true, // Watch for addition/removal of child nodes
            subtree: true    // Watch descendants as well
            // We don't typically need 'attributes' or 'characterData' for this task
        });

        console.log("[Dzen Expander] MutationObserver is active. Waiting for DOM changes...");

    }, INITIAL_DELAY_MS);

    // --- Manual Stop Function ---
    window.stopDzenExpander = () => {
         stopScript("Manually stopped by user via console command.");
    };
    console.log("[Dzen Expander] Run `window.stopDzenExpander()` in the console to stop the script manually.");

    // --- Safety Stop on Page Unload ---
    // Ensure the observer is disconnected when navigating away or closing the tab
    window.addEventListener('beforeunload', () => {
        stopScript("Page unloading.");
    });

})();