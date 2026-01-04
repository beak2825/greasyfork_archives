// ==UserScript==
// @name         Neopets: Redeem AC Staff Tournament first item
// @namespace    Nyu@Clraik
// @version      0.2
// @description  Redeems AC Staff Tournament first item until there are no more spendable points
// @author       Nyu
// @match        *://*.neopets.com/altador/colosseum/staff/index.phtml
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533083/Neopets%3A%20Redeem%20AC%20Staff%20Tournament%20first%20item.user.js
// @updateURL https://update.greasyfork.org/scripts/533083/Neopets%3A%20Redeem%20AC%20Staff%20Tournament%20first%20item.meta.js
// ==/UserScript==

(function() {
    'use strict'
    // Between clicks, in seconds
    const minToWait = 1
    const maxToWait = 2

    if (document.querySelector('.pointsBadge:nth-child(2) div').innerText === '0') return
    const itemImg = document.querySelector('.staffPrizeShopContainer .prize-item img')
    if(itemImg) {
        itemImg.click()
        setTimeout(() => {
            document.querySelector("#acStaff-drop-content .btn.yes-button").click()
            setTimeout(() => {
                document.querySelector('#acStaff-drop-content .purchase-result-button button').click()
                location.reload()
            }, Math.floor(Math.random() * ((maxToWait * 1000) - (minToWait * 1000) + 1) + (minToWait * 1000)))
        }, Math.floor(Math.random() * ((maxToWait * 1000) - (minToWait * 1000) + 1) + (minToWait * 1000)))
    }
})();