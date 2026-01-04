// ==UserScript==
// @name         Cardmarket export wants / wishlist
// @namespace    http://tampermonkey.net/
// @version      2024-04-15
// @description  Basic wants / wishlist export (only amount and card)
// @author       You
// @match        https://www.cardmarket.com/*/*/Wants/*
// @exclude      https://www.cardmarket.com/*/*/Wants/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492454/Cardmarket%20export%20wants%20%20wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/492454/Cardmarket%20export%20wants%20%20wishlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('button')
    button.innerText = 'Export'
    button.classList.add('btn', 'btn-primary')
    button.style.marginLeft = '0.75rem'
    button.addEventListener('click', () => {
        const rows = [...document.querySelectorAll('#WantsListTable > .table td.name')].map(
            node => {
                const amount = node.closest('tr').querySelector('.amount').innerText
                let name = node.innerText
                if (name.match('\(V\.\\d\)')) {
                    name = name.slice(0, -6) // remove (V.X) notation, usually incompatible
                }
                return `${amount} ${name}`
            }
        )
        GM_setClipboard(rows.join('\n'), "text", () => alert('Cards copied to clipboard'))
    })

    document.querySelector('[href*="AddDeckList"]').insertAdjacentElement('afterend', button)

})();