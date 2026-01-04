// ==UserScript==
// @name         SullyTavern Auto Resend on Empty AI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the send button in Sully Tavern when "Google AI Studio Candidate text empty" error occurs.
// @author       Your Helper
// @match        http://127.0.0.1:8000/*
// @match        http://localhost:8000/*
// @match        http://127.0.0.1:8000
// @match        http://localhost:8000
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536658/SullyTavern%20Auto%20Resend%20on%20Empty%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/536658/SullyTavern%20Auto%20Resend%20on%20Empty%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_ERROR_SUBSTRING = "Google AI Studio Candidate text empty";
    const BUTTON_ID = "send_but";
    const SCRIPT_PREFIX = "[SullyTavern AutoResend] ";

    let errorHandlingInitialized = false;

    function handleError(errorSource, errorDetails) {
        let errorMessage = "";

        if (typeof errorDetails === 'string') {
            errorMessage = errorDetails;
        } else if (errorDetails instanceof Error) {
            errorMessage = errorDetails.message || "";
        } else if (errorDetails && typeof errorDetails.reason !== 'undefined') { // For unhandledrejection event
            if (errorDetails.reason instanceof Error) {
                errorMessage = errorDetails.reason.message || "";
            } else if (typeof errorDetails.reason === 'string') {
                errorMessage = errorDetails.reason;
            }
        }

        if (typeof errorMessage === 'string' && errorMessage.includes(TARGET_ERROR_SUBSTRING)) {
            console.log(SCRIPT_PREFIX + `Target error detected via ${errorSource}: "${errorMessage}". Clicking send button.`);
            clickSendButton();
        }
    }

    function initializeErrorHandlers() {
        if (errorHandlingInitialized) {
            return;
        }

        // 1. Hook console.error (as a fallback, unhandledrejection is primary for this error)
        if (typeof console !== 'undefined' && typeof console.error !== 'undefined') {
            const originalConsoleError = console.error;
            console.error = function(...args) {
                originalConsoleError.apply(console, args);
                if (args.length > 0) {
                    handleError("console.error", args[0]);
                }
            };
        }

        // 2. Hook unhandled promise rejections (primary method for this error)
        if (typeof window !== 'undefined') {
            window.addEventListener('unhandledrejection', function(event) {
                // We don't need to log the full event object in the final version
                // console.log(SCRIPT_PREFIX + "Unhandled rejection EVENT caught.");
                handleError("unhandledrejection", event);
            });
        }
        errorHandlingInitialized = true;
        console.log(SCRIPT_PREFIX + "Script loaded and error listeners active.");
    }

    function clickSendButton() {
        setTimeout(() => {
            const sendButton = document.getElementById(BUTTON_ID);
            if (sendButton) {
                if (sendButton.offsetParent !== null && !sendButton.disabled) {
                    sendButton.click();
                    // console.log(SCRIPT_PREFIX + "Send button clicked."); // Можно раскомментировать, если хотите видеть подтверждение клика
                } else {
                    console.warn(SCRIPT_PREFIX + `Send button found but is not clickable (Visible: ${sendButton.offsetParent !== null}, Disabled: ${sendButton.disabled}).`);
                }
            } else {
                console.warn(SCRIPT_PREFIX + `Send button with ID "${BUTTON_ID}" NOT FOUND.`);
            }
        }, 100); // 100 мс задержка
    }

    // Initialize handlers
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeErrorHandlers);
    } else {
        initializeErrorHandlers();
    }
    window.addEventListener('load', () => {
        if (!errorHandlingInitialized) {
            initializeErrorHandlers();
        }
    });

})();