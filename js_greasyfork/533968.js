// ==UserScript==
// @name         Civitai - Restore Censored Models
// @namespace    http://www.facebook.com/Tophness
// @version      1.2.5
// @description  Automates clicking browsing mode options (X/XXX) on civitai.com, handles initial states correctly, waits for grid container & updates, and restores potentially missing grid items, ensuring X/XXX are ON at the end.
// @author       Chris Malone
// @match        https://civitai.com/models*
// @match        https://civitai.com/user/*/models*
// @match        https://civitai.com/search/models*
// @match        https://www.civitai.com/models*
// @match        https://www.civitai.com/user/*/models*
// @match        https://www.civitai.com/search/models*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533968/Civitai%20-%20Restore%20Censored%20Models.user.js
// @updateURL https://update.greasyfork.org/scripts/533968/Civitai%20-%20Restore%20Censored%20Models.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const FIRST_TARGET_SELECTOR = '.flex.items-center.gap-3 .mantine-UnstyledButton-root.mantine-ActionIcon-root:nth-child(3)';
    const BROWSING_MODE_CONTAINER_SELECTOR = '#browsing-mode';
    const GRID_CONTAINER_SELECTOR = 'div[style*="grid-template-columns"]';
    const ITEM_SELECTOR_INSIDE_CONTAINER = ':scope > div';
    const LABELS_TO_TARGET = ["X", "XXX"];
    const CONTAINER_WAIT_TIMEOUT_MS = 20000;
    const MUTATION_WAIT_TIMEOUT_MS = 20000;
    const MUTATION_INACTIVITY_DELAY_MS = 1750;
    const SCRIPT_START_DELAY_MS = 1500;
    const CLICK_DELAY_MS = 150;
    function waitForElement(selector, parent = document.body, timeout = 30000) {
        return new Promise((resolve) => {
            const existingElement = parent.querySelector(selector);
            if (existingElement) {
                return resolve(existingElement);
            }
            let observer;
            const timer = setTimeout(() => {
                if (observer) {
                    observer.disconnect();
                }
                console.error(`Timeout waiting for element: ${selector} within parent:`, parent);
                resolve(null);
            }, timeout);
            observer = new MutationObserver((mutations) => {
                const targetElement = parent.querySelector(selector);
                if (targetElement) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve(targetElement);
                }
            });
            observer.observe(parent || document.body, { childList: true, subtree: true });
        });
    }
    function waitForGridUpdate(gridContainer) {
        console.log("Waiting for grid item updates to stabilize within container:", gridContainer);
        return new Promise((resolve) => {
            if (!gridContainer || !(gridContainer instanceof Element)) {
                 console.error("waitForGridUpdate called with invalid gridContainer:", gridContainer);
                 return resolve(false);
            }
            let Gtimer = null;
            let observer;
            const overallTimeout = setTimeout(() => {
                console.error(`Grid item update stabilization timed out after ${MUTATION_WAIT_TIMEOUT_MS / 1000}s.`);
                if (observer) observer.disconnect();
                clearTimeout(Gtimer);
                resolve(false);
            }, MUTATION_WAIT_TIMEOUT_MS);
            const mutationCallback = (mutationsList) => {
                 const relevantMutations = mutationsList.some(mutation => mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0));
                 if (!relevantMutations) return;
                clearTimeout(Gtimer);
                Gtimer = setTimeout(() => {
                    console.log(`Grid item updates stabilized after ${MUTATION_INACTIVITY_DELAY_MS}ms of inactivity.`);
                    if (observer) observer.disconnect();
                    clearTimeout(overallTimeout);
                    resolve(true);
                }, MUTATION_INACTIVITY_DELAY_MS);
            };
            observer = new MutationObserver(mutationCallback);
            observer.observe(gridContainer, { childList: true });
            Gtimer = setTimeout(() => {
                 console.log(`No relevant grid item mutations detected, assuming stable after initial ${MUTATION_INACTIVITY_DELAY_MS}ms wait.`);
                 if (observer) observer.disconnect();
                 clearTimeout(overallTimeout);
                 resolve(true);
            }, MUTATION_INACTIVITY_DELAY_MS);
        });
    }
    async function findAndSetBrowsingModeOptions(parentSelector, targetLabels, mode) {
        console.log(`Looking for browsing mode container: ${parentSelector} to set labels [${targetLabels.join(', ')}] to '${mode}'`);
        const parentElement = await waitForElement(parentSelector, document.body, 15000);
        if (!parentElement) {
            console.error('Browsing mode container not found:', parentSelector);
            return false;
        }
        const potentialLabels = parentElement.querySelectorAll('label');
        console.log(`Found ${potentialLabels.length} potential label elements under ${parentSelector}`);
        let clickedSomething = false;
        if (potentialLabels.length === 0) {
             console.error(`No labels found under ${parentSelector}. Cannot set options.`);
             return false;
        }
        for (const label of potentialLabels) {
            let labelText = '';
            const labelClone = label.cloneNode(true);
            const inputInClone = labelClone.querySelector('input');
            if (inputInClone) inputInClone.remove();
            labelText = labelClone.textContent?.trim();
            if (labelText && targetLabels.includes(labelText)) {
                console.log(`Found label with text "${labelText}"`);
                const isChecked = label.getAttribute('data-checked') === 'true';
                console.log(`Label "${labelText}" current state (data-checked): ${isChecked}`);
                let shouldClick = false;
                if (mode === 'ensure_on' && !isChecked) {
                    console.log(`Need to turn ON "${labelText}".`);
                    shouldClick = true;
                } else if (mode === 'ensure_off' && isChecked) {
                    console.log(`Need to turn OFF "${labelText}".`);
                    shouldClick = true;
                } else {
                    console.log(`Label "${labelText}" is already in the desired state ('${mode}' requires checked=${mode === 'ensure_on'}). No click needed.`);
                }
                if (shouldClick) {
                    console.log(`Clicking label for "${labelText}"`);
                    if (typeof label.click === 'function') {
                        label.click();
                        clickedSomething = true;
                        await new Promise(resolve => setTimeout(resolve, CLICK_DELAY_MS));
                    } else {
                        console.error(`Label element for "${labelText}" found, but cannot 'click' it:`, label);
                        const input = label.querySelector('input[type="checkbox"]') || document.getElementById(label.getAttribute('for'));
                         if (input && typeof input.click === 'function') {
                             console.log(`Falling back to clicking input for "${labelText}"`);
                             input.click();
                             clickedSomething = true;
                             await new Promise(resolve => setTimeout(resolve, CLICK_DELAY_MS));
                         } else {
                             console.error(`Fallback input click also not possible for "${labelText}".`);
                         }
                    }
                }
            }
        }
        if (!clickedSomething && mode === 'ensure_on') console.log("All target labels were already ON.");
        if (!clickedSomething && mode === 'ensure_off') console.log("All target labels were already OFF.");
        return true;
    }
    function findGridItemsInContainer(gridContainer) {
        if (!gridContainer || !(gridContainer instanceof Element)) {
            console.error('findGridItemsInContainer called with invalid container:', gridContainer);
            return null;
        }
        const items = gridContainer.querySelectorAll(ITEM_SELECTOR_INSIDE_CONTAINER);
        return items;
    }
    async function runCivitaiAutomation() {
        console.log("Civitai Enhancer v1.2.3 (State Aware): Starting automation sequence...");
        console.log("--- Step 1: Open Panel ---");
        const firstTarget = await waitForElement(FIRST_TARGET_SELECTOR);
        if (!firstTarget) {
            console.error("Initial target element (panel toggle) not found. Aborting script.");
            return;
        }
        console.log(`Waiting for grid container (${GRID_CONTAINER_SELECTOR}) after ensuring OFF...`);
        let gridContainerElement = await waitForElement(GRID_CONTAINER_SELECTOR, document.body, CONTAINER_WAIT_TIMEOUT_MS);
        if (!gridContainerElement) {
             console.error("Grid container did not appear after ensuring OFF within timeout. Aborting.");
             return;
        }
        console.log("Grid container found:", gridContainerElement);
        console.log("Clicking initial target to ensure panel is open:", firstTarget);
        firstTarget.click();
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("--- Step 2: Ensure X/XXX are OFF ---");
        const turnedOffOptions = await findAndSetBrowsingModeOptions(BROWSING_MODE_CONTAINER_SELECTOR, LABELS_TO_TARGET, 'ensure_off');
        if (!turnedOffOptions) {
             console.error("Failed to find browsing mode container to turn options OFF. Aborting.");
             return;
        }
        const gridStable1 = await waitForGridUpdate(gridContainerElement);
        if (!gridStable1) {
             console.warn("Grid items did not stabilize after ensuring OFF. Item capture might be unreliable.");
        } else {
             console.log("Grid items finished updating (All Items State).");
        }
        const allGridItemsNodelist = findGridItemsInContainer(gridContainerElement);
        const allGridItems = allGridItemsNodelist ? Array.from(allGridItemsNodelist) : [];
        const allItemIds = new Set(allGridItems.map(item => item.id).filter(id => id));
        console.log(`Stored ${allGridItems.length} grid items (potentially including hidden ones).`);
        if (allGridItems.length === 0) {
            console.warn("No grid items found while X/XXX were off. Restoration might not work correctly.");
        }
         allGridItems.forEach((item, index) => {
            if (!item.id) {
            }
        });
        console.log("--- Step 3: Ensure X/XXX are ON ---");
        const browsingPanelVisible = document.querySelector(BROWSING_MODE_CONTAINER_SELECTOR);
        if (!browsingPanelVisible) {
            console.log("Browsing panel seems closed, reopening...");
            const targetToReopen = await waitForElement(FIRST_TARGET_SELECTOR);
            if (targetToReopen) {
                 targetToReopen.click();
                 await new Promise(resolve => setTimeout(resolve, 300));
            } else {
                 console.error("Could not find button to reopen panel. Aborting.");
                 return;
            }
        }
        const turnedOnOptions = await findAndSetBrowsingModeOptions(BROWSING_MODE_CONTAINER_SELECTOR, LABELS_TO_TARGET, 'ensure_on');
         if (!turnedOnOptions) {
             console.error("Failed to find browsing mode container to turn options ON. Aborting restoration.");
             return;
         }
        console.log(`Waiting for grid container (${GRID_CONTAINER_SELECTOR}) after ensuring ON...`);
        gridContainerElement = await waitForElement(GRID_CONTAINER_SELECTOR, document.body, CONTAINER_WAIT_TIMEOUT_MS);
        if (!gridContainerElement) {
             console.error("Grid container did not appear after ensuring ON within timeout. Aborting comparison.");
             return;
        }
        console.log("Grid container found:", gridContainerElement);
        const gridStable2 = await waitForGridUpdate(gridContainerElement);
        if (!gridStable2) {
             console.warn("Grid items did not stabilize after ensuring ON. Item restoration might be unreliable.");
        } else {
             console.log("Grid items finished updating (Final State).");
        }
        const currentGridItemsNodelist = findGridItemsInContainer(gridContainerElement);
        const currentGridItems = currentGridItemsNodelist ? Array.from(currentGridItemsNodelist) : [];
        const currentItemIds = new Set(currentGridItems.map(item => item.id).filter(id => id));
        console.log(`Found ${currentGridItems.length} current grid items after ensuring ON.`);
        console.log("--- Step 4: Comparing and Restoring ---");
        if (allGridItems.length === 0) {
             console.log("No initial 'all items' were stored (X/XXX off state), skipping restoration.");
        } else {
            const missingItems = [];
            allGridItems.forEach(initialItem => {
                if (initialItem.id && !currentItemIds.has(initialItem.id)) {
                     const elementInDoc = document.getElementById(initialItem.id);
                     const elementInCurrentGrid = gridContainerElement.querySelector(`#${CSS.escape(initialItem.id)}`);
                     if (!elementInCurrentGrid) {
                         console.log(`Detected missing item (ID: ${initialItem.id}). Preparing to restore.`);
                         missingItems.push(initialItem);
                     } else {
                          console.warn(`Item (ID: ${initialItem.id}) seems present in grid container DOM but wasn't in the initial NodeList query. Skipping restore for safety.`);
                     }
                }
            });
            if (missingItems.length > 0) {
                console.log(`Found ${missingItems.length} items missing from the final grid state. Attempting to re-add them.`);
                if (gridContainerElement) {
                    missingItems.forEach(item => {
                        console.log(`Re-adding item (ID: ${item.id || 'No ID'})`);
                        if (item.parentElement) {
                            console.log(`Item ${item.id} is still attached to DOM (parent: ${item.parentElement.tagName}), moving to grid.`);
                            gridContainerElement.appendChild(item);
                        } else {
                             console.log(`Item ${item.id} seems detached from DOM, appending to grid.`);
                             gridContainerElement.appendChild(item);
                        }
                    });
                    console.log("Restoration attempt complete.");
                } else {
                    console.error("Cannot restore missing items because the grid container was not found at the restoration stage.");
                }
            } else {
                console.log("No missing items (with IDs) detected between the 'all items' state and the final state.");
            }
        }
        const finalTarget = document.querySelector(FIRST_TARGET_SELECTOR);
        const finalPanel = document.querySelector(BROWSING_MODE_CONTAINER_SELECTOR);
        if (finalTarget && finalPanel) {
            finalTarget.click();
        }
    }
    setTimeout(runCivitaiAutomation, SCRIPT_START_DELAY_MS);
})();