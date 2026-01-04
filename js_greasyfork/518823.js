// ==UserScript==
// @name         Torn: Gimme Pepper Spray
// @namespace    tenren.gimme_pepperspray
// @version      0.1
// @description  Gimme Pepper Spray!
// @author       Tenren
// @match        https://www.torn.com/bigalgunshop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518823/Torn%3A%20Gimme%20Pepper%20Spray.user.js
// @updateURL https://update.greasyfork.org/scripts/518823/Torn%3A%20Gimme%20Pepper%20Spray.meta.js
// ==/UserScript==

/*
    Based on Lugburz [2386297]'s Gimme Beers and Gimme Basket! script.
 */

function addButton() {
    if ($('div.content-title > h4').size() > 0 && $('#buyPSprayBtn').size() < 1) {
        const button = `<button id="buyPSprayBtn" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Gimme Pepper Spray!</button>
                        <span id="buyPSprayResult" style="font-size: 12px; font-weight: 100;"></span>`;
        $('div.content-title > h4').append(button);
        $('#buyPSprayBtn').on('click', async () => {
            $('#buyPSprayResult').text('');
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: 392,
                    amount: 100,
                    shoparea: 100

                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        $('#buyPSprayResult').html(msg.text).css('color', msg.success ? 'green' : 'red');
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
