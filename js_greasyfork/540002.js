// ==UserScript==
// @name         Udemy Transcript Copy Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show copy button next to AI Assistant after transcript is available
// @author       Imran Pollob
// @license      MIT
// @match        https://www.udemy.com/course/*/learn/lecture/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/540002/Udemy%20Transcript%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/540002/Udemy%20Transcript%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    function tryGetTranscript() {
        let startTime = Date.now();

        function check() {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed > 10) {
                console.log("⏱️ Stopped trying to find transcript panel after 10 seconds.");
                return;
            }

            const panel = document.querySelector('[data-purpose="transcript-panel"]');
            const spans = panel ? panel.querySelectorAll('span[data-purpose="cue-text"]') : null;

            if (panel && spans && spans.length > 0) {
                insertCopyButton(panel);
            } else {
                setTimeout(check, 1000);
            }
        }

        check();
    }

    function insertCopyButton(panel) {
        if (document.getElementById('copy-transcript-btn')) return; // avoid duplicates
        const btn = document.createElement('button');
        btn.id = 'copy-transcript-btn';
        btn.innerText = '📋 Copy';
        btn.style.marginLeft = '10px';
        btn.style.padding = '5px 10px';
        btn.style.backgroundColor = 'white';
        btn.style.borderColor = '#007791';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        btn.onclick = function() {
            const spans = panel.querySelectorAll('span[data-purpose="cue-text"]');
            const text = Array.from(spans).map(span => span.textContent.trim()).join(' ');
            GM_setClipboard(text);
            console.log("✅ Transcript copied to clipboard!");
        };

        const aiAssistantSpan = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === 'Transcript');
        if (aiAssistantSpan && aiAssistantSpan.parentNode) {
            aiAssistantSpan.parentNode.insertBefore(btn, aiAssistantSpan.nextSibling);
        } else {
            // fallback if AI Assistant not found
            document.body.appendChild(btn);
        }
    }

    function observeUrlChange() {
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log("🔄 URL changed, checking for transcript.");
                const btn = document.getElementById('copy-transcript-btn');
                if (btn) btn.remove();
                tryGetTranscript();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        tryGetTranscript();
        observeUrlChange();
    });
})();
