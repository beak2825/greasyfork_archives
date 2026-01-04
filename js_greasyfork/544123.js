// ==UserScript==
// @name         Drawaria Report Dialog - Always Enabled & Never Closes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combines features to prevent the Drawaria.online report dialog from auto-closing and keeps its "Send report" button always enabled.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/544123/Drawaria%20Report%20Dialog%20-%20Always%20Enabled%20%20Never%20Closes.user.js
// @updateURL https://update.greasyfork.org/scripts/544123/Drawaria%20Report%20Dialog%20-%20Always%20Enabled%20%20Never%20Closes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REPORT_MODAL_ID = 'reportdlg';
    const REPORT_BUTTON_SELECTOR = 'div.modal-footer button.btn-primary';
    const ORIGINAL_BUTTON_TEXT = 'Send report'; // Standard English text for the button

    let reportButtonObserver = null; // Observer for the button's attributes
    let pollingIntervalId = null;    // Interval ID for waiting for Bootstrap modal instance

    /**
     * Overrides the 'hide' method of the Bootstrap modal instance to prevent auto-closing.
     * This function will be called repeatedly until the Bootstrap instance is available.
     * @returns {boolean} True if the override was successful, false otherwise.
     */
    function overrideReportModalHide() {
        if (typeof jQuery === 'function' && jQuery.fn.modal) {
            const reportModalElement = document.getElementById(REPORT_MODAL_ID);
            if (reportModalElement) {
                const $reportModal = jQuery(reportModalElement);
                let modalInstance = $reportModal.data('bs.modal');

                if (modalInstance) {
                    // Store original hide method if not already done
                    if (!modalInstance._originalHide_tampermonkey) {
                        modalInstance._originalHide_tampermonkey = modalInstance.hide;
                    }

                    // Override the hide method to do nothing.
                    modalInstance.hide = function(event) {
                        console.log('Tampermonkey: Intercepted #reportdlg modal.hide() call. Preventing close.');
                        if (event && typeof event.preventDefault === 'function') {
                            event.preventDefault(); // Prevent default if an event is passed
                        }
                        // Do NOT call modalInstance._originalHide_tampermonkey();
                    };

                    console.log('Tampermonkey: Successfully overridden hide method for #reportdlg modal instance.');
                    return true;
                } else {
                    console.log('Tampermonkey: #reportdlg element found, but modal instance not yet available. Retrying...');
                }
            } else {
                console.log('Tampermonkey: #reportdlg element not found yet. (Should be handled by outer observer).');
            }
        } else {
            console.log('Tampermonkey: jQuery or Bootstrap Modal plugin not loaded yet. Retrying...');
        }
        return false;
    }

    /**
     * Attaches a MutationObserver to the report button to prevent it from being disabled
     * and ensures its text remains correct.
     * @param {HTMLElement} buttonElement The button to observe.
     */
    function enableButtonPermanently(buttonElement) {
        if (!buttonElement) {
            console.log('Tampermonkey: Button element not found to attach observer.');
            return;
        }

        // Disconnect any existing observer to prevent duplicates
        if (reportButtonObserver) {
            reportButtonObserver.disconnect();
            reportButtonObserver = null;
        }

        reportButtonObserver = new MutationObserver(function(mutationsList) {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    if (buttonElement.disabled) {
                        buttonElement.removeAttribute('disabled');
                        console.log('Tampermonkey: Re-enabled report button attribute.');
                    }
                } else if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Check if text content changed to "Sending..."
                    if (buttonElement.textContent.trim() === 'Sending...') {
                        buttonElement.textContent = ORIGINAL_BUTTON_TEXT;
                        console.log('Tampermonkey: Reverted button text to "' + ORIGINAL_BUTTON_TEXT + '".');
                    }
                }
            });
        });

        // Start observing the button for attribute changes and text content changes
        reportButtonObserver.observe(buttonElement, {
            attributes: true,         // Observe attribute changes
            childList: true,          // Observe direct children (e.g., text nodes)
            characterData: true,      // Observe changes to text content of text nodes
            subtree: false            // No need to observe deeper within the button
        });

        console.log('Tampermonkey: MutationObserver attached to report button for enabling.');

        // Initial check to ensure the button is enabled and has correct text when script loads
        if (buttonElement.disabled) {
            buttonElement.removeAttribute('disabled');
        }
        if (buttonElement.textContent.trim() === 'Sending...') {
            buttonElement.textContent = ORIGINAL_BUTTON_TEXT;
        }
    }

    /**
     * Starts polling to wait for the Bootstrap modal instance to be ready, then overrides it.
     */
    function startPollingForModalOverride() {
        const MAX_POLLING_ATTEMPTS = 50; // 50 attempts * 200ms interval = 10 seconds
        let currentPollingAttempts = 0;

        // Clear any existing polling interval to prevent duplicates
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }

        pollingIntervalId = setInterval(() => {
            currentPollingAttempts++;
            if (overrideReportModalHide() || currentPollingAttempts >= MAX_POLLING_ATTEMPTS) {
                clearInterval(pollingIntervalId); // Stop polling on success or max attempts
                pollingIntervalId = null;
                console.log('Tampermonkey: Polling for modal override stopped.');
            }
        }, 200); // Check every 200 milliseconds
    }

    // Main observer to wait for the report dialog element to appear in the DOM
    const mainModalExistenceObserver = new MutationObserver((mutationsList, observerInstance) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    // Check if the added node is our target modal or contains it
                    const reportModal = node.id === REPORT_MODAL_ID ? node : (node.querySelector ? node.querySelector('#' + REPORT_MODAL_ID) : null);
                    if (reportModal) {
                        console.log('Tampermonkey: Detected #reportdlg modal element in DOM.');

                        // 1. Found the modal element, now apply button enabling fix
                        const reportButton = reportModal.querySelector(REPORT_BUTTON_SELECTOR);
                        if (reportButton) {
                            enableButtonPermanently(reportButton);
                        } else {
                            console.warn('Tampermonkey: Report button not found within the modal immediately. Button enabling might be delayed.');
                            // A fallback: observe the modal for button appearance if not found immediately
                            const buttonFindObserver = new MutationObserver((btnMutations, btnObserver) => {
                                for(const btnMutation of btnMutations) {
                                    if (btnMutation.type === 'childList' && btnMutation.addedNodes.length > 0) {
                                        const foundButton = reportModal.querySelector(REPORT_BUTTON_SELECTOR);
                                        if (foundButton) {
                                            enableButtonPermanently(foundButton);
                                            btnObserver.disconnect();
                                            console.log('Tampermonkey: Button found via secondary observer.');
                                            return;
                                        }
                                    }
                                }
                            });
                            buttonFindObserver.observe(reportModal, { childList: true, subtree: true });
                        }

                        // 2. Start polling to override Bootstrap's modal instance hide method
                        startPollingForModalOverride();

                        // Disconnect the main observer as we've successfully found the modal element
                        observerInstance.disconnect();
                        console.log('Tampermonkey: Main modal existence observer disconnected.');
                        return;
                    }
                }
            }
        }
    });

    // Start observing the document body for changes in its children and subtree.
    // This is crucial as the modal can be dynamically added anywhere.
    mainModalExistenceObserver.observe(document.body, { childList: true, subtree: true });

    // Initial check (once DOM is ready) in case the modal is already present
    // or loaded very quickly after script injection.
    const initialCheck = () => {
        const reportModal = document.getElementById(REPORT_MODAL_ID);
        if (reportModal) {
            console.log('Tampermonkey: #reportdlg modal found during initial DOMContentLoaded check.');
            const reportButton = reportModal.querySelector(REPORT_BUTTON_SELECTOR);
            if (reportButton) {
                enableButtonPermanently(reportButton);
            }
            startPollingForModalOverride();
            mainModalExistenceObserver.disconnect(); // Disconnect if found immediately
            console.log('Tampermonkey: Main observer disconnected on initial find.');
        } else {
            console.log('Tampermonkey: #reportdlg not found during initial check, relying on observer.');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialCheck);
    } else {
        initialCheck();
    }

})();