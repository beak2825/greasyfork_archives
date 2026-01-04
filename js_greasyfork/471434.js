// ==UserScript==
// @name         Torn: Gimme smokes
// @version      0.1.3
// @description  Gimme smokes!
// @author       Yoyo
// @match        https://www.torn.com/index.php
// @grant        none
// @namespace https://greasyfork.org/users/1132032
// @downloadURL https://update.greasyfork.org/scripts/471434/Torn%3A%20Gimme%20smokes.user.js
// @updateURL https://update.greasyfork.org/scripts/471434/Torn%3A%20Gimme%20smokes.meta.js
// ==/UserScript==
// This code was partially taken from https://github.com/f2404/torn-userscripts/raw/master/gimme_beers.user.js

var suitcaseSize = 0;
try {
    suitcaseSize = document.querySelector('.user-info').querySelector('.msg').querySelector('.bold:nth-of-type(4)').textContent;
} catch(e) {

}

function addButton() {
    if ($('div.content-title > h4').size() > 0 && $('#buySmokeBtn').size() < 1) {
        const button = `<button id="buySmokeBtn" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Gimme smokes!</button>
                        <span id="buySmokeResult" style="font-size: 12px; font-weight: 100;"></span>`;
        $('div.content-title > h4').append(button);
        $('#buySmokeBtn').on('click', async () => {
            $('#buySmokeResult').text('');
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    amount: suitcaseSize,
                    ID: 42,
                    travelShop: '1',
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

    // Your code here...
    addButton();
})();
