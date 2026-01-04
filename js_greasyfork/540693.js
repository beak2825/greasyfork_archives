// ==UserScript==
// @name         Judiciary No Context Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add "No Context" button to convert search result URLs to direct judgment URLs
// @author       You
// @match        https://legalref.judiciary.hk/lrs/common/search/search_result_detail_frame.jsp*
// @license      MIT
// @match        https://legalref.judiciary.hk/lrs/common/search/ju_bottom.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540693/Judiciary%20No%20Context%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/540693/Judiciary%20No%20Context%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonAdded = false; // Global flag to prevent duplicate buttons

    function addNoContextButton() {
        // Prevent adding button if already added
        if (buttonAdded) return;

        // Check if we're in the bottom frame where the navigation links are
        if (window.location.pathname.includes('ju_bottom.jsp')) {
            // Look for the td element that contains all the navigation links
            const navCell = document.querySelector('td[nowrap=""]');

            if (navCell && !navCell.querySelector('a[data-no-context="true"]')) {
                // Extract DIS parameter from current URL or from hidden input
                let disValue = new URLSearchParams(window.location.search).get('DIS');

                // If not found in URL, try to get from hidden input
                if (!disValue) {
                    const hiddenDIS = document.querySelector('input[name="DIS"]');
                    if (hiddenDIS) {
                        disValue = hiddenDIS.value;
                    }
                }

                if (disValue) {
                    // Create the "No Context" link with same styling as other links
                    const noContextLink = document.createElement('a');
                    noContextLink.href = 'javascript:void(0)';
                    noContextLink.className = 'default';
                    noContextLink.style.fontSize = '10pt';
                    noContextLink.textContent = 'No Context';
                    noContextLink.setAttribute('data-no-context', 'true'); // Unique identifier

                    // Add click handler to navigate to the no-context URL
                    noContextLink.onclick = function() {
                        const noContextUrl = `https://legalref.judiciary.hk/lrs/common/ju/ju_frame.jsp?DIS=${disValue}`;
                        window.top.location.href = noContextUrl;
                    };

                    // Add the separator and the link at the end of the navigation
                    const separator = document.createTextNode(' | ');
                    navCell.appendChild(separator);
                    navCell.appendChild(noContextLink);

                    buttonAdded = true; // Set flag to prevent duplicates
                }
            }
        }

        // If we're in the main frameset, try to add the button to the bottom frame
        if (window.location.pathname.includes('search_result_detail_frame.jsp') && !buttonAdded) {
            // Wait for frames to load
            setTimeout(function() {
                if (buttonAdded) return; // Double-check flag

                try {
                    const bottomFrame = window.frames['bottomFrame'];
                    if (bottomFrame && bottomFrame.document) {
                        // Check if button already exists in the frame
                        const existingButton = bottomFrame.document.querySelector('a[data-no-context="true"]');
                        if (existingButton) {
                            buttonAdded = true;
                            return;
                        }

                        // Run the button addition function in the bottom frame context
                        const script = bottomFrame.document.createElement('script');
                        script.textContent = `
                            (function() {
                                if (window.noContextButtonAdded) return; // Check frame-specific flag

                                setTimeout(function() {
                                    const navCell = document.querySelector('td[nowrap=""]');

                                    if (navCell && !navCell.querySelector('a[data-no-context="true"]')) {
                                        let disValue = new URLSearchParams(window.location.search).get('DIS');

                                        if (!disValue) {
                                            const hiddenDIS = document.querySelector('input[name="DIS"]');
                                            if (hiddenDIS) {
                                                disValue = hiddenDIS.value;
                                            }
                                        }

                                        if (disValue) {
                                            const noContextLink = document.createElement('a');
                                            noContextLink.href = 'javascript:void(0)';
                                            noContextLink.className = 'default';
                                            noContextLink.style.fontSize = '10pt';
                                            noContextLink.textContent = 'No Context';
                                            noContextLink.setAttribute('data-no-context', 'true');

                                            noContextLink.onclick = function() {
                                                const noContextUrl = 'https://legalref.judiciary.hk/lrs/common/ju/ju_frame.jsp?DIS=' + disValue;
                                                window.top.location.href = noContextUrl;
                                            };

                                            const separator = document.createTextNode(' | ');
                                            navCell.appendChild(separator);
                                            navCell.appendChild(noContextLink);

                                            window.noContextButtonAdded = true; // Set frame-specific flag
                                        }
                                    }
                                }, 500);
                            })();
                        `;
                        bottomFrame.document.head.appendChild(script);
                        buttonAdded = true; // Set main flag
                    }
                } catch (e) {
                    console.log('Could not access bottom frame:', e);
                }
            }, 1000);
        }
    }

    // Run when page loads (only once)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!buttonAdded) addNoContextButton();
        });
    } else {
        if (!buttonAdded) addNoContextButton();
    }

    // Single delayed attempt only if button hasn't been added
    setTimeout(function() {
        if (!buttonAdded) addNoContextButton();
    }, 2000);
})();