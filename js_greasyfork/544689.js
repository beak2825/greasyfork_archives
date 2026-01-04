// ==UserScript==
// @name         Facebook Marketplace: Auto Renew/Relist ALL Listings
// @namespace    http://tampermonkey.net/
// @version      3.14
// @description  Uses the power of heuristic processing to auto renew + relist ALL your FB Marketplace listings.
// @author       Prismaris
// @match        https://www.facebook.com/marketplace/you/selling*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544689/Facebook%20Marketplace%3A%20Auto%20RenewRelist%20ALL%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/544689/Facebook%20Marketplace%3A%20Auto%20RenewRelist%20ALL%20Listings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration Constants ---
    const ENABLE_DELETE_BUTTON = false; // Set to 'true' to show the Delete All button, 'false' to hide it.

    // --- Global State ---
    let isMacroRunning = false;

    // Debugging report object, reset before each debug run
    let debugReport = {
        deleteRelistButtonsProcessed: 0,
        overallThreeDotsButtonsFound: 0,
        threeDotsMenusOpened: 0,
        markAsSoldHeuristicApplied: 0,
        renewMenuItemsDetected: 0,
        deleteMenuItemsDetected: 0
    };

    // --- Utility Functions ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /** Scrolls the window to the top of the page smoothly. */
    async function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        await sleep(500); // Allow animation to start/complete
    }

    /**
     * Scrolls the page down repeatedly to ensure all listings are loaded into the DOM.
     * @param {Function} updateLoadingStatus - Callback to update the UI button text.
     * @returns {Promise<void>} A promise that resolves when all listings are presumed loaded.
     */
    async function loadAllListings(updateLoadingStatus) {
        console.log("Starting to load all listings by scrolling...");
        let lastScrollHeight = document.documentElement.scrollHeight;
        let attempts = 0;
        const MAX_SCROLL_ATTEMPTS = 50;
        const SCROLL_PAUSE_MS = 600;

        while (attempts < MAX_SCROLL_ATTEMPTS) {
            updateLoadingStatus(`Loading listings (${attempts + 1}/${MAX_SCROLL_ATTEMPTS})...`);
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
            await sleep(SCROLL_PAUSE_MS); // Give time for new content to load and animation

            const newScrollHeight = document.documentElement.scrollHeight;
            if (newScrollHeight === lastScrollHeight) {
                console.log(`All listings appear to be loaded after ${attempts + 1} scrolls.`);
                updateLoadingStatus("All listings loaded.");
                return;
            }
            lastScrollHeight = newScrollHeight;
            attempts++;
        }
        console.warn(`Stopped loading listings after ${MAX_SCROLL_ATTEMPTS} attempts. Not all listings may be loaded.`);
        updateLoadingStatus("Loading timed out. May not have all listings.");
    }

    // --- Tampermonkey Menu Command for Debugging ---

    /** Toggles the debugging mode on/off. */
    function toggleDebugMode() {
        let currentDebugState = GM_getValue('fbm_debug_mode', false);
        let newDebugState = !currentDebugState;
        GM_setValue('fbm_debug_mode', newDebugState);
        alert(`Facebook Marketplace Renew/Relist Debug Mode is now ${newDebugState ? 'ON' : 'OFF'}.`);
        registerDebugMenuCommand(); // Re-register to update menu text
    }

    /** Registers the Tampermonkey menu command for toggling debug mode. */
    function registerDebugMenuCommand() {
        let currentDebugState = GM_getValue('fbm_debug_mode', false);
        GM_registerMenuCommand(currentDebugState ? "Disable FBMP Debug Mode" : "Enable FBMP Debug Mode", toggleDebugMode);
    }

    // --- Button Identification ---

    /** Checks if element is a "More options" (three dots) button. */
    function isThreeDotsButton(btn) {
      return btn.matches('div[role="button"][aria-label*="More options"]');
    }

    /** Checks if element is a "Renew listing" menu item. */
    function isRenewListingButton(btn) {
      return btn.matches('div[role="menuitem"]') && (btn.textContent || '').includes('Renew');
    }

    /** Checks if element is a "Delete & Relist" button. */
    function isDeleteRelistButton(btn) {
      return btn.matches('div[role="button"]') && (btn.textContent || '').includes('Delete & Relist');
    }

    /** Checks if element is a "Delete listing" menu item. */
    function isDeleteListingMenuItem(btn) {
        return btn.matches('div[role="menuitem"]') && (btn.textContent || '').includes('Delete listing');
    }

    // --- Helper for Heuristic Identification ---

    /** Extracts product title from various aria-label patterns. */
    function extractTitleFromAriaLabel(ariaLabel) {
        let match = ariaLabel.match(/(?:for\s|sold\s|listing\s|Share\s|options for\s)(.*)/i);
        if (match && match[1]) {
            return match[1].trim();
        }
        if (ariaLabel && ariaLabel.length > 10) { // Fallback for direct titles
            return ariaLabel.trim();
        }
        return null;
    }

    // --- Core Macro Logic Functions ---

    /** Clicks/detects "Delete & Relist" buttons based on debug mode. */
    function clickDeleteRelistAll(currentDebugMode) {
      const buttons = Array.from(document.querySelectorAll('div[role="button"][tabindex="0"]')).filter(isDeleteRelistButton);
      if (currentDebugMode) {
          debugReport.deleteRelistButtonsProcessed = buttons.length;
          console.log(`[DEBUG] Detected ${buttons.length} "Delete & Relist" button(s). (NOT CLICKED)`);
      } else {
          buttons.forEach(btn => btn.click());
          console.log(`Clicked ${buttons.length} "Delete & Relist" button(s).`);
      }
    }

    /** Identifies and opens "More options" menus using a robust heuristic. */
    function openAllThreeDotsMenus(currentDebugMode) {
        let countOpenedMenus = 0;
        const processedListingElements = new Set();

        const allMoreOptionButtons = Array.from(document.querySelectorAll('div[role="button"][aria-label*="More options"]'));
        if (currentDebugMode) {
            debugReport.overallThreeDotsButtonsFound = allMoreOptionButtons.length;
            console.log(`[DEBUG] Found ${allMoreOptionButtons.length} potential "More options" buttons across the page.`);
        }

        allMoreOptionButtons.forEach(moreBtn => {
            const moreBtnAriaLabel = moreBtn.getAttribute('aria-label');
            if (!moreBtnAriaLabel) return;

            const expectedProductTitle = extractTitleFromAriaLabel(moreBtnAriaLabel);
            if (!expectedProductTitle) return;

            // Escape product title for use in CSS selector
            const escapedProductTitle = CSS.escape(expectedProductTitle);

            let currentElement = moreBtn;
            let foundListingCard = null;
            const MAX_TRAVERSAL_DEPTH = 10;

            for (let i = 0; i < MAX_TRAVERSAL_DEPTH && currentElement && currentElement !== document.body; i++) {
                const hasMatchingTitleElement = currentElement.querySelector(`[aria-label*="${escapedProductTitle}"]`);
                // Check for BOTH "Mark as sold" OR "Mark out of stock" buttons
                const hasMarkAsSoldOrOutOfStockButton = currentElement.querySelector(
                    'div[role="button"][aria-label*="Mark as sold"], ' +
                    'div[role="button"][aria-label*="Mark out of stock"]'
                );
                const hasPriceText = (currentElement.textContent || '').match(/(\$|£|€|CA\$|US\$|C\$)\s*\d+(?:[.,]\d{1,2})?/);

                if (hasMatchingTitleElement && hasPriceText && hasMarkAsSoldOrOutOfStockButton) {
                    foundListingCard = currentElement;
                    break;
                }
                currentElement = currentElement.parentElement;
            }

            if (foundListingCard && !processedListingElements.has(foundListingCard)) {
                const actualMoreBtnForThisCard = foundListingCard.querySelector('div[role="button"][aria-label*="More options"]');

                if (actualMoreBtnForThisCard) {
                    actualMoreBtnForThisCard.click();
                    countOpenedMenus++;
                    processedListingElements.add(foundListingCard);
                    if (currentDebugMode) {
                        debugReport.markAsSoldHeuristicApplied++;
                        console.log(`[DEBUG] Applied heuristic and opened menu for: "${expectedProductTitle}"`);
                    }
                } else {
                    if (currentDebugMode) console.warn(`[DEBUG] Could not re-find moreBtn inside identified listing card for "${expectedProductTitle}".`);
                }
            } else {
                if (currentDebugMode && !processedListingElements.has(foundListingCard)) {
                    let skipReasons = [];
                    if (!foundListingCard) {
                        skipReasons.push("Heuristic failed to find a valid listing card parent.");
                        let heuristicStatus = { title: false, soldOrOutOfStock: false, price: false };
                        let tempCurrent = moreBtn;
                        for (let k = 0; k < MAX_TRAVERSAL_DEPTH && tempCurrent && tempCurrent !== document.body; k++) {
                            if (!heuristicStatus.title && tempCurrent.querySelector(`[aria-label*="${escapedProductTitle}"]`)) heuristicStatus.title = true;
                            if (!heuristicStatus.soldOrOutOfStock && tempCurrent.querySelector('div[role="button"][aria-label*="Mark as sold"], div[role="button"][aria-label*="Mark out of stock"]')) heuristicStatus.soldOrOutOfStock = true;
                            if (!heuristicStatus.price && (tempCurrent.textContent || '').match(/(\$|£|€|CA\$|US\$|C\$)\s*\d+(?:[.,]\d{1,2})?/)) heuristicStatus.price = true;
                            if (heuristicStatus.title && heuristicStatus.soldOrOutOfStock && heuristicStatus.price) break;
                            tempCurrent = tempCurrent.parentElement;
                        }
                        console.log(`[DEBUG] For "${moreBtnAriaLabel}", heuristic status (Title: ${heuristicStatus.title}, Sold/OutOfStock: ${heuristicStatus.soldOrOutOfStock}, Price: ${heuristicStatus.price}).`);
                    }
                    if (foundListingCard && processedListingElements.has(foundListingCard)) { // This check is actually redundant due to outer if condition
                        skipReasons.push("Listing card already processed.");
                    }
                    console.log(`[DEBUG] More options button for "${moreBtnAriaLabel}" skipped. Reasons: ${skipReasons.join(" | ")}`);
                }
            }
        });
        debugReport.threeDotsMenusOpened = countOpenedMenus;
        console.log(`Identified and opened ${countOpenedMenus} "More Options" (three dots) menus for listings.`);
    }

    /** Detects/clicks "Renew listing" options, displays debug report if in debug mode. */
    function performRenewDetectionAndClicks(currentDebugMode) {
      return new Promise(resolve => {
        setTimeout(() => {
          const buttons = Array.from(document.querySelectorAll('div[role="menuitem"][tabindex="0"]')).filter(isRenewListingButton);

          if (currentDebugMode) {
              debugReport.renewMenuItemsDetected = buttons.length;
              console.log(`[DEBUG] Detected ${buttons.length} "Renew listing" button(s). (NOT CLICKED)`);

              let message = "Facebook Marketplace Macro Debug Report (Renew/Relist):\n\n";
              message += `1. "Delete & Relist" buttons detected: ${debugReport.deleteRelistButtonsProcessed}\n`;
              message += `2. Total "More options" buttons found: ${debugReport.overallThreeDotsButtonsFound}\n`;
              message += `3. Listing "More options" menus opened: ${debugReport.threeDotsMenusOpened}\n`;
              message += `4. Heuristic successfully applied: ${debugReport.markAsSoldHeuristicApplied} times.\n`;
              message += `5. "Renew listing" buttons detected: ${debugReport.renewMenuItemsDetected}\n\n`;
              message += "NOTE: In Debug Mode, NO actions (renew/delete) are performed.\n" +
                         "Please inspect browser console for detailed logs (F12).";
              alert(message); // Show popup

          } else {
              buttons.forEach(btn => btn.click());
              console.log(`Clicked ${buttons.length} "Renew listing" option(s).`);
          }
          resolve();
        }, 600); // Delay for menu items to render
      });
    }

    /** Detects/clicks "Delete listing" options, displays debug report if in debug mode. */
    function performDeleteDetectionAndClicks(currentDebugMode) {
        return new Promise(resolve => {
            setTimeout(() => {
                const buttons = Array.from(document.querySelectorAll('div[role="menuitem"][tabindex="0"]')).filter(isDeleteListingMenuItem);

                if (currentDebugMode) {
                    debugReport.deleteMenuItemsDetected = buttons.length;
                    console.log(`[DEBUG] Detected ${buttons.length} "Delete listing" menu item(s). (NOT CLICKED)`);

                    let message = "Facebook Marketplace Macro Debug Report (Delete All):\n\n";
                    message += `1. Total "More options" buttons found: ${debugReport.overallThreeDotsButtonsFound}\n`;
                    message += `2. Listing "More options" menus opened: ${debugReport.threeDotsMenusOpened}\n`;
                    message += `3. Heuristic successfully applied: ${debugReport.markAsSoldHeuristicApplied} times.\n`;
                    message += `4. "Delete listing" menu items detected: ${debugReport.deleteMenuItemsDetected}\n\n`;
                    message += "NOTE: In Debug Mode, NO actions (renew/delete) are performed.\n" +
                               "Please inspect browser console for detailed logs (F12).";
                    alert(message);

                } else {
                    buttons.forEach(btn => btn.click());
                    console.log(`Clicked ${buttons.length} "Delete listing" menu item(s).`);
                }
                resolve();
            }, 600); // Delay for menu items to render
        });
    }

    /** Orchestrates normal Renew/Relist macro flow. */
    async function macroFlowRenew(currentDebugMode) {
      clickDeleteRelistAll(currentDebugMode);
      await sleep(800);
      openAllThreeDotsMenus(currentDebugMode);
      await performRenewDetectionAndClicks(currentDebugMode);
      await scrollToTop();
    }

    /** Orchestrates normal Delete All macro flow. */
    async function macroFlowDelete(currentDebugMode) {
        openAllThreeDotsMenus(currentDebugMode); // Open menus for deletion
        await performDeleteDetectionAndClicks(currentDebugMode);
        await scrollToTop();
    }

    /** Orchestrates the debug specific macro flow for Renew/Relist. */
    async function startDebugProcessRenew() {
        debugReport = { // Reset for this run
            deleteRelistButtonsProcessed: 0, overallThreeDotsButtonsFound: 0, threeDotsMenusOpened: 0,
            markAsSoldHeuristicApplied: 0, renewMenuItemsDetected: 0, deleteMenuItemsDetected: 0
        };
        console.log("Running Facebook Marketplace Debug Process (Renew/Relist)...");
        const currentDebugMode = true;

        clickDeleteRelistAll(currentDebugMode);
        await sleep(800);
        openAllThreeDotsMenus(currentDebugMode);
        await performRenewDetectionAndClicks(currentDebugMode);
        await scrollToTop();
    }

    /** Orchestrates the debug specific macro flow for Delete All. */
    async function startDebugProcessDelete() {
        debugReport = { // Reset for this run
            deleteRelistButtonsProcessed: 0, overallThreeDotsButtonsFound: 0, threeDotsMenusOpened: 0,
            markAsSoldHeuristicApplied: 0, renewMenuItemsDetected: 0, deleteMenuItemsDetected: 0
        };
        console.log("Running Facebook Marketplace Debug Process (Delete All)...");
        const currentDebugMode = true;

        openAllThreeDotsMenus(currentDebugMode);
        await performDeleteDetectionAndClicks(currentDebugMode);
        await scrollToTop();
    }

    // --- Custom Confirmation Modal (for Delete All) ---
    async function showConfirmationPopup() {
        return new Promise(resolve => {
            const modalId = 'fbm-confirm-modal';
            const existingModal = document.getElementById(modalId);
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = modalId;
            Object.assign(modal.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
                alignItems: 'center', zIndex: '10000'
            });

            const content = document.createElement('div');
            Object.assign(content.style, {
                backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)', textAlign: 'center', maxWidth: '400px',
                color: '#333'
            });
            content.innerHTML = `
                <h3 style="margin-top:0;">Are you absolutely sure you want to DELETE ALL listings?</h3>
                <p style="margin-bottom:20px; font-weight:bold; color:red;">This action cannot be undone!</p>
                <div style="display:flex; justify-content:space-around; gap:10px;">
                    <button id="fbm-confirm-no" style="padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; background-color: #f0f2f5; color: #333; font-weight: bold;">No, Cancel</button>
                    <button id="fbm-confirm-yes" style="padding: 10px 20px; border: none; border-radius: 4px; cursor: not-allowed; background-color: #ccc; color: #fff; font-weight: bold;">Yes, Delete (3)</button>
                </div>
            `;

            modal.appendChild(content);
            document.body.appendChild(modal);

            const yesBtn = document.getElementById('fbm-confirm-yes');
            const noBtn = document.getElementById('fbm-confirm-no');

            noBtn.onclick = () => {
                modal.remove();
                resolve(false); // User chose No
            };

            let countdown = 3;
            yesBtn.textContent = `Yes, Delete (${countdown})`;
            yesBtn.disabled = true; // Ensure disabled initially
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    yesBtn.textContent = `Yes, Delete (${countdown})`;
                } else {
                    clearInterval(countdownInterval);
                    yesBtn.textContent = 'Yes, Delete';
                    yesBtn.style.backgroundColor = '#fa3e3e'; // Red for delete
                    yesBtn.style.cursor = 'pointer';
                    yesBtn.disabled = false;
                }
            }, 1000);

            yesBtn.onclick = () => {
                if (yesBtn.disabled) return; // Prevent click before countdown ends
                clearInterval(countdownInterval);
                modal.remove();
                resolve(true); // User chose Yes
            };
        });
    }


    // --- Macro Execution Orchestration ---

    /** Prepares and runs the macro, updating UI state. */
    async function prepareAndRunMacro(actionType) {
        const currentDebugMode = GM_getValue('fbm_debug_mode', false);
        console.log(`prepareAndRunMacro called for ${actionType}. Current debugMode: ${currentDebugMode}`);

        const btn = document.getElementById(`fbm-${actionType}-all-btn`);

        if (isMacroRunning) {
            console.log("Macro already in progress. Please wait.");
            return;
        }

        isMacroRunning = true;
        if (btn) {
            btn.textContent = 'Loading listings...';
            btn.style.background = '#a9a9a9';
            btn.disabled = true;
        }

        // --- Confirmation for Delete All (always shown) ---
        if (actionType === 'delete') {
            const confirmed = await showConfirmationPopup();
            if (!confirmed) {
                console.log("Delete All cancelled by user.");
                if (btn) {
                    btn.textContent = 'Delete All';
                    btn.style.background = '#fa3e3e';
                    btn.disabled = false;
                }
                isMacroRunning = false;
                return;
            }
        }

        // --- Load all listings ---
        try {
            await loadAllListings((status) => {
                if (btn) btn.textContent = status;
            });
            await sleep(2500); // Post-load sleep for DOM stability
            console.log("Post-load sleep complete. Proceeding with macro.");
        } catch (error) {
            console.error("Error loading all listings:", error);
            alert("Failed to load all listings. See console for details.");
            if (btn) {
                btn.textContent = 'Error Loading!';
                btn.style.background = 'red';
            }
            isMacroRunning = false;
            if (btn) btn.disabled = false;
            return;
        }


        // --- Run the macro/debug process ---
        if (btn) {
            btn.textContent = currentDebugMode ? 'Running Debug...' : `Running ${actionType === 'delete' ? 'Deletion' : 'Macro'}...`;
            btn.style.background = '#a9a9a9';
        }

        try {
            if (currentDebugMode) {
                if (actionType === 'delete') {
                    await startDebugProcessDelete();
                } else {
                    await startDebugProcessRenew();
                }
            } else {
                if (actionType === 'delete') {
                    await macroFlowDelete(currentDebugMode);
                } else {
                    await macroFlowRenew(currentDebugMode);
                }
            }
            if (!currentDebugMode && btn) btn.textContent = 'Done!';
        } catch (error) {
            console.error(`Macro execution for ${actionType} failed:`, error.message);
            alert(`Macro execution for ${actionType} failed: ` + error.message);
            if (btn) {
                btn.textContent = 'Error!';
                btn.style.background = 'red';
            }
        } finally {
            setTimeout(() => {
                if (btn) {
                    btn.textContent = actionType === 'delete' ? 'Delete All' : 'Renew/Relist All';
                    btn.style.background = actionType === 'delete' ? '#fa3e3e' : '#1877f2';
                    btn.disabled = false;
                }
                isMacroRunning = false;
            }, currentDebugMode ? 5000 : 3000); // Longer delay in debug mode for popup
        }
    }

    // --- UI Injection ---

    /** Injects the UI elements (buttons and auto-run toggle) into the page. */
    function addMacroUI() {
      const header = Array.from(document.querySelectorAll('h1')).find(h => h.textContent.trim() === 'Your listings');
      if (!header) return;

      const parentSpan = header.closest('span');
      if (!parentSpan || document.getElementById('fbm-renew-relist-all-btn')) return;

      const container = document.createElement('div');
      Object.assign(container.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: '8px',
        marginBottom: '16px'
      });

      // Renew/Relist All Button
      const renewBtn = document.createElement('button');
      renewBtn.id = 'fbm-renew-relist-all-btn';
      renewBtn.textContent = 'Renew/Relist All';
      Object.assign(renewBtn.style, {
        background: '#1877f2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '15px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        transition: 'background 0.2s'
      });
      renewBtn.onmouseenter = () => { if(renewBtn.textContent === 'Renew/Relist All') renewBtn.style.background = '#165ecb'; };
      renewBtn.onmouseleave = () => { if(renewBtn.textContent === 'Renew/Relist All') renewBtn.style.background = '#1877f2'; };
      renewBtn.onclick = () => prepareAndRunMacro('renew');

      // Delete All Button (conditional visibility)
      if (ENABLE_DELETE_BUTTON) {
          const deleteBtn = document.createElement('button');
          deleteBtn.id = 'fbm-delete-all-btn';
          deleteBtn.textContent = 'Delete All';
          Object.assign(deleteBtn.style, {
            background: '#fa3e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '15px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'background 0.2s'
          });
          deleteBtn.onmouseenter = () => { if(deleteBtn.textContent === 'Delete All') deleteBtn.style.background = '#e03737'; };
          deleteBtn.onmouseleave = () => { if(deleteBtn.textContent === 'Delete All') deleteBtn.style.background = '#fa3e3e'; };
          deleteBtn.onclick = () => prepareAndRunMacro('delete');
          container.appendChild(deleteBtn); // Only append if enabled
      }

      const autoRenewEnabled = GM_getValue('fbm_auto_renew_enabled', false);

      const toggleLabel = document.createElement('label');
      Object.assign(toggleLabel.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        color: '#65676b',
        cursor: 'pointer'
      });

      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.id = 'fbm-auto-renew-toggle';
      toggle.style.accentColor = '#1877f2';
      toggle.checked = autoRenewEnabled;
      toggleLabel.appendChild(toggle);
      toggleLabel.appendChild(document.createTextNode('Auto Run on Load'));

      container.appendChild(renewBtn);
      // Delete button inserted here conditionally by the 'if (ENABLE_DELETE_BUTTON)' block above
      container.appendChild(toggleLabel);
      parentSpan.parentNode.insertBefore(container, parentSpan.nextSibling);

      toggle.addEventListener('change', function () {
        GM_setValue('fbm_auto_renew_enabled', this.checked);
        console.log(`Auto Run/Renew is now ${this.checked ? 'ON' : 'OFF'}.`);
      });

      if (autoRenewEnabled) {
        console.log("Auto Run is enabled. Executing on page load...");
        setTimeout(() => prepareAndRunMacro('renew'), 2000);
      }
    }

    // --- Initialization ---

    /** Waits for "Your listings" header to inject UI. */
    function waitForHeaderAndInjectUI() {
      const tryInject = () => addMacroUI();
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', tryInject);
      } else {
          tryInject();
      }
      new MutationObserver(tryInject).observe(document.body, { childList: true, subtree: true });
    }

    // Start everything
    registerDebugMenuCommand();
    waitForHeaderAndInjectUI();
})();