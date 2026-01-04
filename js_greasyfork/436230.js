// ==UserScript==
// @name         Sync Koinly Wallets
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Press CTRL+SHIFT+S to sync all wallets.
// @author       You
// @match        https://app.koinly.io/p/wallets
// @icon         https://www.google.com/s2/favicons?domain=koinly.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436230/Sync%20Koinly%20Wallets.user.js
// @updateURL https://update.greasyfork.org/scripts/436230/Sync%20Koinly%20Wallets.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const cl = console.log

    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyS') {
            syncWallets()
        }
    });

    async function syncWallets () {
        const $table = document.querySelector('.wallets-table')
        const $syncBtns = $table.querySelectorAll('.wallet-well-more button')

        for (const $btn of $syncBtns) {
            if ($btn.innerText.includes('Sync')) {
                $btn.click()
            }
        }
    }
})();