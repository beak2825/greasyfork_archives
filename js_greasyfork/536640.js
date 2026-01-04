// ==UserScript==
// @name         YouTube Live Chat One-Word Rule Buttons (Space, Below Ticker, Reliable)
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Adds two rows of one-word rule buttons (with visible space after command) below the ticker in YouTube Live Chat
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536640/YouTube%20Live%20Chat%20One-Word%20Rule%20Buttons%20%28Space%2C%20Below%20Ticker%2C%20Reliable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536640/YouTube%20Live%20Chat%20One-Word%20Rule%20Buttons%20%28Space%2C%20Below%20Ticker%2C%20Reliable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // [button one-word text, !rX command, !wX command]
    const rules = [
        ["Caps", "!r1", "!w1"],
        ["Spam", "!r2", "!w2"],
        ["Slurs", "!r3", "!w3"],
        ["English", "!r4", "!w4"],
        ["Misinformation", "!r5", "!w5"],
        ["Racism", "!r6", "!w6"],
        ["Transphobia", "!r7", "!w7"],
        ["Kindness", "!r8", "!w8"],
        ["Sexual", "!r9", "!w9"]
    ];

    function waitForTicker(cb, tries = 0) {
        const ticker = document.querySelector('div#ticker');
        if (ticker && ticker.parentElement) {
            cb(ticker);
        } else if (tries < 60) {
            setTimeout(() => waitForTicker(cb, tries + 1), 500);
        }
    }

    function getChatInputElements() {
        const inputFieldRenderer = document.querySelector('yt-live-chat-text-input-field-renderer');
        if (!inputFieldRenderer) return null;
        return {
            inputDiv: inputFieldRenderer.querySelector('div[contenteditable][id="input"]'),
            placeholderLabel: inputFieldRenderer.querySelector('label#label')
        };
    }

    function createBar(buttonConfigs, btnBg, btnColor) {
        const bar = document.createElement('div');
        bar.style.cssText = `
            width: 100%;
            background: #222;
            color: #fff;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 6px 12px 6px 12px;
            box-sizing: border-box;
            align-items: center;
            border-radius: 6px 6px 0 0;
            margin-bottom: 4px;
            font-size: 15px;
            z-index: 10;
        `;

        for (const [text, command] of buttonConfigs) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                padding: 6px 14px;
                border: none;
                border-radius: 3px;
                background: ${btnBg};
                color: ${btnColor};
                cursor: pointer;
                white-space: nowrap;
                font-weight: bold;
            `;
            btn.onclick = () => {
                const elements = getChatInputElements();
                if (elements?.inputDiv && elements.placeholderLabel) {
                    // Clear input
                    elements.inputDiv.innerText = '';
                    // Insert command (no space)
                    elements.inputDiv.innerText = command;
                    // Focus and move cursor to end
                    elements.inputDiv.focus();
                    const range = document.createRange();
                    range.selectNodeContents(elements.inputDiv);
                    range.collapse(false);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    // Insert a space using execCommand (reliable for contenteditable)
                    document.execCommand('insertText', false, ' ');
                    // Hide placeholder
                    elements.placeholderLabel.hidden = true;
                    // Trigger input event
                    const event = new Event('input', { bubbles: true });
                    elements.inputDiv.dispatchEvent(event);
                } else {
                    alert('Chat input not found!');
                }
            };
            bar.appendChild(btn);
        }
        return bar;
    }

    function insertBars(ticker) {
        // Only insert once
        if (document.getElementById('tm-bar-below-ticker')) return;

        // Orange (!wX) bar (top)
        const orangeBar = createBar(
            rules.map(([text, , wcmd]) => [text, wcmd]),
            "#ffb300", "#222"
        );
        orangeBar.id = "tm-bar-below-ticker-warn";

        // Blue (!rX) bar (bottom)
        const blueBar = createBar(
            rules.map(([text, rcmd]) => [text, rcmd]),
            "#3ea6ff", "#fff"
        );
        blueBar.id = "tm-bar-below-ticker";

        // Insert both bars after the ticker
        ticker.parentElement.insertBefore(orangeBar, ticker.nextSibling);
        ticker.parentElement.insertBefore(blueBar, orangeBar.nextSibling);
    }

    function main() {
        waitForTicker(insertBars);
    }
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            main();
        }
    }).observe(document.body, { childList: true, subtree: true });

    main();
})();
