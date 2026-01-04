// ==UserScript==
// @name         Open WebUI Message Fetcher from URL
// @namespace    https://bluee.dev
// @version      1.0.0
// @supportURL   https://github.com/Panonim/openwebui-userscript/discussions
// @source       https://github.com/Panonim/openwebui-userscript
// @description  Automatically injects and sends a message in Open WebUI if a `?message=` parameter is present in the URL. Useful for automation, testing, or scripted interactions.
// @author       Artur Flis C 2025
// @match        *://localhost:3000/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542330/Open%20WebUI%20Message%20Fetcher%20from%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/542330/Open%20WebUI%20Message%20Fetcher%20from%20URL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const message = new URLSearchParams(window.location.search).get('message');
    if (!message) return;

    console.log('[TM] Script loaded. Message param:', message);

    let sent = false;
    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(() => {
        if (sent || attempts++ > maxAttempts) {
            clearInterval(interval);
            return;
        }

        const container = document.getElementById('chat-input-container');
        const editable = container?.querySelector('[contenteditable="true"]');

        if (editable) {
            console.log('[TM] Found editable field. Injecting text...');
            editable.focus();
            editable.innerText = message;
            editable.dispatchEvent(new InputEvent('input', { bubbles: true }));
            setTimeout(() => {
                console.log('[TM] Sending Enter key');
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                });

                editable.dispatchEvent(enterEvent);

                sent = true;
                clearInterval(interval);
                console.log('[TM] Message sent via Enter');
            }, 250);
        }
    }, 500);
})();