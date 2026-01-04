// ==UserScript==
// @name         Prevent ChatGPT Conversation Reset
// @description  Prevents certain browser events from reaching official ChatGPT code. Otherwise, with chat history turned off, the conversation may be reset after 10 min of inactivity or even spontaneously while being active. The script is designed to only affect official ChatGPT code and to avoid interfering with other userscripts or browser extensions.
//
// @namespace    http://tampermonkey.net/
// @version      2023.10.06
//
// @author       Henrik Hank
// @license      MIT (https://opensource.org/license/mit/)
//
// @match        *://chat.openai.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476734/Prevent%20ChatGPT%20Conversation%20Reset.user.js
// @updateURL https://update.greasyfork.org/scripts/476734/Prevent%20ChatGPT%20Conversation%20Reset.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

void function userscript() {
    "use strict";

    const origAddEventListenerFn = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function(type, listener, optionsOrUseCapture) {
        let mayPass = true;

        if (
            (type === "focus" && this === window) ||
            type === "visibilitychange"  // Always on `document`.
        ) {
            // Identify function caller via call stack.
            const callStack = new Error().stack + "\n";
            const secondStackEntry = callStack.match(/-extension:[/][/].*\n(.+)/)?.[1];  // First entry is this function, attributed to userscript manager.
            const calledByBrowserExtension = secondStackEntry?.includes("-extension://") ?? false;  // Also accounts for userscripts (managed by extension).

            // Filter out event types in official code.
            mayPass = calledByBrowserExtension;

            // Filter `visibilitychange` event partially.
            if (! calledByBrowserExtension && type === "visibilitychange") {
                origAddEventListenerFn.call(
                    this,
                    type,
                    function(event) {
                        // Filter out only this event subtype.
                        if (document.visibilityState !== "visible") {
                            listener.call(this, event);
                        }
                    },
                    optionsOrUseCapture
                );
            }
        }

        if (mayPass) {
            origAddEventListenerFn.apply(this, arguments);
        }
    };
}.call();
