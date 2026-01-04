// ==UserScript==
// @name         Torn: Smoke Me!
// @namespace    ReconDalek_SmokeMe_WW
// @version      1.0
// @description  Script to purchase Smoke Grenades from South Africa
// @author       ReconDalek & TheTDR
// @match        https://www.torn.com/*
// @icon         https://imgur.com/yc5Ipzp.png
// @downloadURL https://update.greasyfork.org/scripts/471828/Torn%3A%20Smoke%20Me%21.user.js
// @updateURL https://update.greasyfork.org/scripts/471828/Torn%3A%20Smoke%20Me%21.meta.js
// ==/UserScript==

function smokeButton(purchaseAmount) {
    if ($('div.content-title > h4').size() > 0 && $('#buySmokeBtn').size() < 1) {
        const button = `<button id="buySmokeBtn" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Smoke Me!</button>
                        <span id="buySmokeResult" style="font-size: 12px; font-weight: 100;"></span>`;
        $('div.content-title').append(button);
        $('#buySmokeBtn').on('click', async () => {
            $('#buySmokeResult').text('');
                await getAction({
                    type: 'post',
                    action: 'shops.php',
                    data: {
                        step: 'buyShopItem',
                        ID: 42,
                        amount: purchaseAmount,
                        travelShop: 1
                    },
                    success: (str) => {
                        try {
                            const msg = JSON.parse(str);
                            $('#buySmokeResult').html(msg.text).css('color', msg.success ? 'green' : 'red');
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
        });
    }
};

(function() {
    'use strict';

    const purchaseCount = parseInt($('div.msg.right-round span.bold:nth-child(3)').text().trim());
    const purchaseTotal = parseInt($('div.msg.right-round span.bold:nth-child(4)').text().trim());
    const purchaseAmount = purchaseTotal - purchaseCount;

    if (
        $('div.content-title.m-bottom10 > h4').text().includes('South Africa')
    ) {
        const amountText = `Amount to purchase: ${purchaseAmount}`;
        const amountContainerHTML = `<div class="amount-container" style="margin-top: 2px; font-weight: normal;">${amountText}</div>`;
        $('div.content-title.m-bottom10').append(amountContainerHTML);
        smokeButton(purchaseAmount);
    }


 
})();
