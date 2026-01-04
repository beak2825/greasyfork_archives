// ==UserScript==
// @name         Torn: Gimme Lollipops
// @namespace    tenren.gimme_lollipops
// @version      0.1
// @description  Gimme lollpops!
// @author       Tenren
// @match        https://www.torn.com/shops.php?step=candy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510146/Torn%3A%20Gimme%20Lollipops.user.js
// @updateURL https://update.greasyfork.org/scripts/510146/Torn%3A%20Gimme%20Lollipops.meta.js
// ==/UserScript==

/*
    Based on Lugburz [2386297]'s Gimme Beers and Gimme Basket! script.
 */

function addButton() {
    if ($('div.content-title > h4').size() > 0 && $('#buyLollipopBtn').size() < 1) {
        const button = `<button id="buyLollipopBtn" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Gimme Lollipops!</button>
                        <span id="buyLollipopResult" style="font-size: 12px; font-weight: 100;"></span>`;
        $('div.content-title > h4').append(button);
        $('#buyLollipopBtn').on('click', async () => {
            $('#buyLollipopResult').text('');
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: 310,
                    amount: 100,
                    shoparea: 101

                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        $('#buyLollipopResult').html(msg.text).css('color', msg.success ? 'green' : 'red');
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

    // Your code here...
    addButton();
})();