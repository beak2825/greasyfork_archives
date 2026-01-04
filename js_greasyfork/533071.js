// ==UserScript==
// @name         Google AI Studio - Send on Enter (Simulates Ctrl+Enter)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Press Enter instead of Ctrl+Enter to send prompts in Google AI Studio.
// @author       AI
// @match        https://aistudio.google.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533071/Google%20AI%20Studio%20-%20Send%20on%20Enter%20%28Simulates%20Ctrl%2BEnter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533071/Google%20AI%20Studio%20-%20Send%20on%20Enter%20%28Simulates%20Ctrl%2BEnter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        const activeElement = document.activeElement;

        if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {

            if (activeElement && activeElement.tagName === 'TEXTAREA') {
                event.preventDefault();
                event.stopPropagation();

                const ctrlEnterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    bubbles: true,
                    cancelable: true,
                    ctrlKey: true
                });

                activeElement.dispatchEvent(ctrlEnterEvent);
            }
        }
    }, true);

})();
