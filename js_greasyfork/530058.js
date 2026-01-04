// ==UserScript==
// @name         CryptoHack Attachments Downloader (fish)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Generates a fish one-liner to download all attachments to `$CRYPTOHACK_ROOT/{category}/{challenge name}` for challenges on cryptohack.com
// @author       みるく
// @match        https://cryptohack.org/*
// @grant        GM_setClipboard
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/530058/CryptoHack%20Attachments%20Downloader%20%28fish%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530058/CryptoHack%20Attachments%20Downloader%20%28fish%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addCopyButtons() {
        document.querySelectorAll('.challenge').forEach(chall => {
            if (chall.querySelector('.copy-btn')) return; // Prevent duplicate buttons
            const desc = chall.querySelector('.challengeDescription');
            // check if there are challenge files
            const files = Array.from(chall.querySelectorAll('a[download]')).map(e => {
                return { "link": e.href, "name": e.textContent.trim() }
            });
            if (files.length === 0) {
                return;
            }
            const category = window.location.pathname.split('/').filter(Boolean).pop();
            const challName = chall.querySelector('.challenge-text').textContent.trim();
            const button = document.createElement('button');
            const payload = [
                `set -q CRYPTOHACK_ROOT`,
                `mkdir -p "$CRYPTOHACK_ROOT/${category}/${challName}"`,
                `cd "$CRYPTOHACK_ROOT/${category}/${challName}"`,
                `${files.map(f => `curl ${f.link} > ${f.name}`).join('&&')}`
            ].join('&&');
            button.textContent = 'Download Attachment';
            button.className = 'copy-btn btn waves-effect waves-light';
            button.style.marginLeft = '10px';
            button.style.cursor = 'pointer';
            button.addEventListener('click', (e) => {
                GM_setClipboard(payload);
                e.stopPropagation();
            });
            chall.querySelector('.challenge-text').appendChild(button);
        });
    }

    // Run when page loads
    addCopyButtons();

    // Run again if DOM updates
    const observer = new MutationObserver(addCopyButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();