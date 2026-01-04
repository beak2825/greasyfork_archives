// ==UserScript==
// @name         Torn: Gimme EBBs
// @namespace    duck.wowow
// @version      0.1
// @description  Adds button that buys 100 empty blood bags when in stock
// @author       Lugburz/Odung
// @match        https://www.torn.com/shops.php?step=pharmacy
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529661/Torn%3A%20Gimme%20EBBs.user.js
// @updateURL https://update.greasyfork.org/scripts/529661/Torn%3A%20Gimme%20EBBs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ($('div.content-title > h4').size() > 0 && $('#buyEBBBtn').size() < 1) {
        const button = `<button id="buyEBBBtn" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Gimme EBBs!</button>
                        <span id="buyEBBResult" style="font-size: 12px; font-weight: 100;"></span>`;
        $('div.content-title > h4').append(button);
        $('#buyEBBBtn').on('click', async () => {
            $('#buyEBBResult').text('');
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: 731,
                    amount: 100,
                    shoparea: 110
                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        $('#buyEBBResult').html(msg.text).css('color', msg.success ? 'green' : 'red');
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        });
    }
})();
