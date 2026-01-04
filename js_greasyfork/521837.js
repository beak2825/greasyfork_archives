// ==UserScript==
// @name         Torn: Gimme Treats
// @version      0.1.4
// @description  Gimme treats!
// @author       yoyoYossarian (originally gimme beers by lugburz)
// @match        https://www.torn.com/shops.php?step=bitsnbobs*
// @grant        none
// @namespace https://greasyfork.org/users/1132032
// @downloadURL https://update.greasyfork.org/scripts/521837/Torn%3A%20Gimme%20Treats.user.js
// @updateURL https://update.greasyfork.org/scripts/521837/Torn%3A%20Gimme%20Treats.meta.js
// ==/UserScript==

function addButton() {
    if ($('div.content-title > h4').size() > 0 && $('#buyBeerBtn').size() < 1) {
        const button = `<button id="buyBeerBtn" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Gimme beers!</button>
                        <span id="buyBeerResult" style="font-size: 12px; font-weight: 100;"></span>`;
        $('div.content-title > h4').append(button);
        $('#buyBeerBtn').on('click', async () => {
            $('#buyBeerResult').text('');
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: 1361,
                    amount: 1,
                    shoparea: 103
                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        $('#buyBeerResult').html(msg.text).css('color', msg.success ? 'green' : 'red');
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