// ==UserScript==
// @name         Asteria Hunt Message Auto-Closer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically closes harvest failure and missing tool messages
// @author       You
// @match        *://*.asteriagame.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546199/Asteria%20Hunt%20Message%20Auto-Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/546199/Asteria%20Hunt%20Message%20Auto-Closer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Partial text matches for messages to auto-close
        messagesToClose: [
            "добыча не удалась",
            "необходимой профессии",
            "необходимого инструмента",
            "не существует",
            "Вы не являетесь призраком"

        ],

        // Time before auto-closing (milliseconds)
        closeDelay: 0,

        // Debug mode (logs actions to console)
        debug: true
    };

    // Logging function
    function debugLog(message) {
        if (CONFIG.debug) {
            console.log(`[Auto-Closer] ${message}`);
        }
    }

    // Main initialization function
    function initAutoCloser() {
        // Check if required objects are available
        if (!window.canvas || !canvas.app || !canvas.app.hunt || !canvas.app.hunt.view) {
            //debugLog("Game objects not available yet");
            return false;
        }

        // Get reference to FarmWindow prototype
        const FarmWindowProto = canvas.app.hunt.view.FarmWindow.prototype;

        // Store original show_message function
        if (!FarmWindowProto.origShowMessage) {
            FarmWindowProto.origShowMessage = FarmWindowProto.show_message;
        }

        // Override show_message function
        FarmWindowProto.show_message = function(msg, col) {
            // Call original function
            this.origShowMessage.call(this, msg, col);

            // Check if this message should be auto-closed
            const shouldClose = CONFIG.messagesToClose.some(text =>
                msg.toLowerCase().includes(text.toLowerCase())
            );

            if (shouldClose) {
                debugLog(`Detected closable message: "${msg}"`);

                // Auto-close after delay
                setTimeout(() => {
                    if (this.parent) {
                        debugLog(`Closing message: "${msg}"`);
                        canvas.EventManager.dispatchEvent(
                            canvas.px.WindowEvent.EVENT_CLOSE,
                            this
                        );
                    }
                }, CONFIG.closeDelay);
            }
        };

        debugLog("Initialized successfully");
        return true;
    }

    // Initialize when ready
    let initAttempts = 0;
    const maxAttempts = 10;
    const initInterval = setInterval(() => {
        if (initAutoCloser() || ++initAttempts >= maxAttempts) {
            clearInterval(initInterval);
            if (initAttempts >= maxAttempts) {
                //debugLog("Initialization failed after max attempts");
            }
        }
    }, 1000);
})();