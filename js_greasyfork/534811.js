// ==UserScript==
// @name         Twitch Auto !join Command (SlateJS Clipboard Injection)
// @namespace    http://tampermonkey.net/
// @version      2024.05.09
// @description  Auto-send "!join" on Twitch chat (modern UI) using clipboard paste for full compatibility
// @author       XDWOLF
// @match        https://www.twitch.tv/yourtwitchchannel
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534811/Twitch%20Auto%20%21join%20Command%20%28SlateJS%20Clipboard%20Injection%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534811/Twitch%20Auto%20%21join%20Command%20%28SlateJS%20Clipboard%20Injection%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const JOIN_COMMAND = "!join";
    const INTERVAL_MS = 15 * 60 * 1000;
    const CHAT_INPUT_SELECTOR = 'div[contenteditable="true"][role="textbox"][data-a-target="chat-input"]';
    const SEND_BUTTON_SELECTOR = 'button[data-a-target="chat-send-button"]';

    let sentOnce = false, interval = null;

    async function simulatePaste(element, value) {
        // Store old clipboard data
        let originalClipboard = '';
        if (navigator.clipboard && navigator.clipboard.readText) {
            try {
                originalClipboard = await navigator.clipboard.readText();
            } catch (e) {}
        }
        // Place value onto clipboard (if permissions allow)
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(value);
            }
        } catch (e) {}

        element.focus();
        // Create a real paste event
        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: new DataTransfer()
        });
        pasteEvent.clipboardData.setData('text/plain', value);

        element.dispatchEvent(pasteEvent);

        // Sometimes execCommand is still needed for full compatibility
        try {
            document.execCommand('paste');
        } catch (e) {}

        // Restore clipboard
        if (originalClipboard && navigator.clipboard && navigator.clipboard.writeText) {
            setTimeout(() => {
                navigator.clipboard.writeText(originalClipboard);
            }, 100);
        }

        // Wait for paste and UI update
        await new Promise(res => setTimeout(res, 200));
        return element.innerText.trim() === value;
    }

    function findEnabledChatInput() {
        return Array.from(document.querySelectorAll(CHAT_INPUT_SELECTOR)).find(el =>
            el.offsetParent &&
            el.getAttribute('aria-disabled') !== 'true' &&
            el.getAttribute('aria-readonly') !== 'true' &&
            !el.classList.contains('disabled')
        );
    }

    function findEnabledSendButton() {
        let btn = document.querySelector(SEND_BUTTON_SELECTOR);
        return btn && !btn.disabled ? btn : null;
    }

    async function sendJoinCommand(initial = false) {
        if (initial && sentOnce) return;
        const chatInput = findEnabledChatInput();
        const sendBtn = findEnabledSendButton();
        if (!chatInput || !sendBtn) return;
        // Paste !join
        const ok = await simulatePaste(chatInput, JOIN_COMMAND);
        if (!ok) return;
        await new Promise(res => setTimeout(res, 200));
        const btn = findEnabledSendButton();
        if (btn) btn.click();
        if (initial && !interval) {
            interval = setInterval(() => sendJoinCommand(false), INTERVAL_MS);
        }
        sentOnce = true;
    }

    function waitForChatThenSend() {
        let observer = new MutationObserver(() => {
            let i = findEnabledChatInput(), b = findEnabledSendButton();
            if (i && b) {
                observer.disconnect();
                sendJoinCommand(true);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            sendJoinCommand(true);
        }, 25000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForChatThenSend);
    } else {
        waitForChatThenSend();
    }

})();
