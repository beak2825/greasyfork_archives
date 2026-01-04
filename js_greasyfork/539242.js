// ==UserScript==
// @name         Display tooltips inline instead
// @namespace    https://github.com/laurenipsum/TTL
// @version      1.6.1
// @description  Replace hover tooltips with inline text display for item and user alerts
// @author       laurenipsum
// @match        https://tacomatoollibrary.myturn.com/library/orgInventory/listReservations*
// @match        https://tacomatoollibrary.myturn.com/library/inventory/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539242/Display%20tooltips%20inline%20instead.user.js
// @updateURL https://update.greasyfork.org/scripts/539242/Display%20tooltips%20inline%20instead.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tooltip inline script loaded');

    function triggerPopoverAndExtract(alertElement, index) {
        return new Promise((resolve) => {
            console.log(`Triggering popover for alert element ${index}`);

            // First, try to trigger Bootstrap popover programmatically
            if (window.$ && typeof window.$.fn.popover === 'function') {
                console.log('Bootstrap/jQuery detected, trying programmatic trigger');
                try {
                    // Initialize popover if not already done
                    $(alertElement).popover();
                    // Show the popover
                    $(alertElement).popover('show');
                    console.log('Bootstrap popover triggered');
                } catch (e) {
                    console.log('Bootstrap popover trigger failed:', e);
                }
            }

            // Try multiple mouse event approaches
            const events = ['mouseenter', 'mouseover'];
            events.forEach(eventType => {
                const event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 0,
                    clientY: 0
                });
                alertElement.dispatchEvent(event);
            });

            // Also try focus events
            alertElement.focus();

            // Wait longer for the popover to be created
            setTimeout(() => {
                console.log('Looking for popover after trigger attempts...');

                // Method 1: Check aria-describedby
                let popover = null;
                const popoverId = alertElement.getAttribute('aria-describedby');
                if (popoverId) {
                    popover = document.getElementById(popoverId);
                    console.log(`Found popover by ID ${popoverId}:`, popover);
                }

                // Method 2: Look for any visible popover
                if (!popover) {
                    const visiblePopovers = document.querySelectorAll('.popover');
                    console.log('All popovers found:', visiblePopovers.length);
                    visiblePopovers.forEach((p, idx) => {
                        console.log(`Popover ${idx}:`, p, 'Display:', p.style.display, 'Visible:', p.offsetParent !== null);
                    });

                    // Get the most recently visible one
                    for (let i = visiblePopovers.length - 1; i >= 0; i--) {
                        if (visiblePopovers[i].offsetParent !== null || visiblePopovers[i].style.display !== 'none') {
                            popover = visiblePopovers[i];
                            console.log('Found visible popover:', popover);
                            break;
                        }
                    }
                }

                // Method 3: Look for popover that was just created/modified
                if (!popover) {
                    const allPopovers = document.querySelectorAll('[id^="popover"], .popover');
                    allPopovers.forEach(p => {
                        console.log('Checking popover:', p.id, p.className, p.style.display);
                    });

                    // Take the last one that's not explicitly hidden
                    for (let i = allPopovers.length - 1; i >= 0; i--) {
                        if (allPopovers[i].style.display !== 'none') {
                            popover = allPopovers[i];
                            console.log('Using last non-hidden popover:', popover);
                            break;
                        }
                    }
                }

                // Method 4: Check if the popover content is in the original HTML structure
                if (!popover) {
                    console.log('Checking for popover in original HTML structure...');
                    const parentContainer = alertElement.closest('.text-danger');
                    if (parentContainer) {
                        popover = parentContainer.querySelector('.popover');
                        console.log('Found popover in parent container:', popover);
                    }
                }

                if (popover) {
                    const popoverContent = popover.querySelector('.popover-content');
                    if (popoverContent) {
                        console.log('Popover content HTML:', popoverContent.innerHTML);

                        // Extract warnings
                        const warnings = [];
                        const allElements = popoverContent.querySelectorAll('p, div');

                        allElements.forEach(element => {
                            // Skip if hidden class is present
                            if (element.classList.contains('hidden')) {
                                console.log('Skipping hidden element:', element.textContent.trim());
                                return;
                            }

                            const text = element.textContent.trim();
                            if (text && text.length > 0) {
                                warnings.push(text);
                                console.log('Found visible warning:', text);
                            }
                        });

                        // Clean up - hide the popover
                        if (window.$ && typeof window.$.fn.popover === 'function') {
                            try {
                                $(alertElement).popover('hide');
                            } catch (e) {
                                console.log('Failed to hide Bootstrap popover:', e);
                            }
                        }

                        // Also try mouse leave events
                        const mouseLeaveEvent = new MouseEvent('mouseleave', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        alertElement.dispatchEvent(mouseLeaveEvent);

                        // Force hide
                        setTimeout(() => {
                            if (popover) {
                                popover.style.display = 'none';
                            }
                        }, 100);

                        resolve(warnings);
                    } else {
                        console.log(`No popover content found for alert element ${index}`);
                        resolve([]);
                    }
                } else {
                    console.log(`No popover found for alert element ${index} after all trigger attempts`);

                    // Let's also check what happens when we manually hover
                    console.log('Please manually hover over the alert icon and check console for popover creation');
                    resolve([]);
                }
            }, 500); // Wait 500ms for popover to appear
        });
    }

    async function replaceTooltipsWithInline() {
        console.log('Running replaceTooltipsWithInline');

        // Find all visible reservation-alert elements (not hidden)
        const alertElements = document.querySelectorAll('.reservation-alert:not(.hidden)');
        console.log('Found visible alert elements:', alertElements.length);

        for (let i = 0; i < alertElements.length; i++) {
            const alertElement = alertElements[i];
            console.log(`Processing alert element ${i}:`, alertElement);

            // Check if we've already processed this element
            if (alertElement.dataset.processed) {
                console.log(`Alert element ${i} already processed, skipping`);
                continue;
            }

            // Log current state of DOM around this element
            console.log('Current DOM around alert element:', alertElement.parentElement.innerHTML);

            // Trigger popover and extract content
            const warnings = await triggerPopoverAndExtract(alertElement, i);

            console.log('Warnings extracted:', warnings);

            // If we found warnings, create inline display
            if (warnings.length > 0) {
                // Find the best place to insert the inline warning
                const parentContainer = alertElement.closest('.text-danger') || alertElement.parentElement;
                const existingInline = parentContainer.parentNode.querySelector('.inline-warning');
                if (existingInline) {
                    existingInline.remove();
                }

                // Create inline warning container
                const inlineWarning = document.createElement('span');
                inlineWarning.className = 'inline-warning';
                inlineWarning.style.cssText = `
                `;

                // Join multiple warnings with " | "
                inlineWarning.textContent = warnings.join(' | ');

                // Insert after the parent container
                parentContainer.parentNode.insertBefore(inlineWarning, parentContainer.nextSibling);

                console.log('Created inline warning:', inlineWarning.textContent);

                // Disable the popover functionality
                alertElement.removeAttribute('data-toggle');
                alertElement.removeAttribute('data-placement');
                alertElement.removeAttribute('data-html');
                alertElement.removeAttribute('data-trigger');

                // Mark as processed
                alertElement.dataset.processed = 'true';

                console.log(`Successfully processed alert element ${i}`);
            } else {
                console.log(`No visible warnings found for alert element ${i}`);
            }

            // Small delay between processing elements
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    // Function to wait for elements and run replacement
    function waitAndReplace() {
        const alertElements = document.querySelectorAll('.reservation-alert:not(.hidden)');
        if (alertElements.length > 0) {
            console.log('Found visible reservation alerts, running replacement');
            replaceTooltipsWithInline();
        } else {
            console.log('No visible reservation alerts found yet, waiting...');
        }
    }

    // Run after page loads with more delays to ensure everything is ready
    setTimeout(waitAndReplace, 2000);
    setTimeout(waitAndReplace, 5000);

    console.log('Tooltip inline script setup complete');

})();
