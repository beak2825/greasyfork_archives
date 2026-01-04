// ==UserScript==
// @name         Torn: All Abroad!
// @namespace    ReconDalek.All_Abroad
// @version      2.0
// @description  Adds buttons below the page title to buy plushies and flowers faster at the maximum quantity you are able to purchase with travel perks
// @author       ReconDalek [2741093]
// @match        https://www.torn.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/7893/7893979.png
// @downloadURL https://update.greasyfork.org/scripts/479120/Torn%3A%20All%20Abroad%21.user.js
// @updateURL https://update.greasyfork.org/scripts/479120/Torn%3A%20All%20Abroad%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const purchaseCount = parseInt($('div.msg.right-round span.bold:nth-child(3)').text().trim());
    const purchaseTotal = parseInt($('div.msg.right-round span.bold:nth-child(4)').text().trim());
    const purchaseAmount = purchaseTotal - purchaseCount;

    if (
        $('div.content-title.m-bottom10 > h4').text().includes('Mexico') ||
        $('div.content-title.m-bottom10 > h4').text().includes('Cayman') ||
        $('div.content-title.m-bottom10 > h4').text().includes('Canada') ||
        $('div.content-title.m-bottom10 > h4').text().includes('Hawaii') ||
        $('div.content-title.m-bottom10 > h4').text().includes('United Kingdom') ||
        $('div.content-title.m-bottom10 > h4').text().includes('Argentina') ||
        $('div.content-title.m-bottom10 > h4').text().includes('Switzerland') ||
        $('div.content-title.m-bottom10 > h4').text().includes('Japan') ||
        $('div.content-title.m-bottom10 > h4').text().includes('China') ||
        $('div.content-title.m-bottom10 > h4').text().includes('UAE') ||
        $('div.content-title.m-bottom10 > h4').text().includes('Africa')
    ) {
        const amountText = `Amount to purchase: ${purchaseAmount}`;
        const amountContainerHTML = `<div class="amount-container" style="margin-top: 2px; font-weight: normal;">${amountText}</div>`;
        $('div.content-title.m-bottom10').append(amountContainerHTML);
    }

    function addButtonWithResult(buttonId, buttonText, itemId) {
        if ($(buttonId).size() < 1) {
            const newButtonText = `${buttonText}`;
            const button = `<button id="${buttonId.slice(1)}" style="color: var(--default-blue-color); cursor: pointer; margin-right: 10px; margin-top: 5px;">${newButtonText}</button>`;
            const result = `<div id="${buttonId.slice(1)}Result" style="font-size: 12px; font-weight: 100;"></div>`;
            const container = `<div style="display: flex; align-items: center;">${button}${result}</div>`;
            $('div.content-title.m-bottom10').append(container);
            $(buttonId).on('click', async () => {
                $(`${buttonId}Result`).text('');
                await getAction({
                    type: 'post',
                    action: 'shops.php',
                    data: {
                        step: 'buyShopItem',
                        ID: itemId,
                        amount: purchaseAmount,
                        travelShop: 1
                    },
                    success: (str) => {
                        try {
                            const msg = JSON.parse(str);
                            $(`${buttonId}Result`).html(msg.text).css('color', msg.success ? 'green' : 'red');
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            });
        }
    }

    if ($('div.content-title.m-bottom10 > h4').text().includes('Mexico')) {
        addButtonWithResult("#mexBtn1", "Buy Dahlias!", 24);
        addButtonWithResult("#mexBtn2", "Buy Jaguars!", 22);

    } else if ($('div.content-title.m-bottom10 > h4').text().includes('Cayman')) {
        addButtonWithResult("#cayBtn1", "Buy Banana Orchids!", 182);
        addButtonWithResult("#cayBtn2", "Buy Stingrays!", 183);

    } else if ($('div.content-title.m-bottom10 > h4').text().includes('Canada')) {
        addButtonWithResult("#canBtn1", "Buy Crocus!", 104);
        addButtonWithResult("#canBtn2", "Buy Wolverines!", 102);

    } else if ($('div.content-title.m-bottom10 > h4').text().includes('Hawaii')) {
        addButtonWithResult("#hawBtn1", "Buy Orchids!", 264);

//    } else if ($('div.content-title.m-bottom10 > h4').text().includes('United Kingdom')) {
//        addButtonWithResult("#ukBtn1", "Buy Heathers (Need ID)!", 10);
//        addButtonWithResult("#ukBtn2", "Buy Nessies (Need ID)!", 10);
//        addButtonWithResult("#ukBtn3", "Buy Red Fox (Need ID)!", 10);

    } else if ($('div.content-title.m-bottom10 > h4').text().includes('Argentina')) {
        addButtonWithResult("#argBtn1", "Buy Ceibo", 86);
        addButtonWithResult("#argBtn2", "Buy Monkeys!", 84);
        addButtonWithResult("#argBtn3", "Buy Tear Gas!", 82);

    } else if ($('div.content-title.m-bottom10 > h4').text().includes('Switzerland')) {
        addButtonWithResult("#swiBtn1", "Buy Chamois!", 94);
        addButtonWithResult("#swiBtn2", "Buy Edelweiss!", 93);

    } else if ($('div.content-title.m-bottom10 > h4').text().includes('Japan')) {
        addButtonWithResult("#jpnBtn1", "Buy Cherry Blossoms (Need ID)!", 10);

//    } else if ($('div.content-title.m-bottom10 > h4').text().includes('China')) {
//        addButtonWithResult("#chnBtn1", "Buy Pandas (Need ID)!", 10);
//        addButtonWithResult("#chnBtn2", "Buy Peony (Need ID)!", 10);

    } else if ($('div.content-title.m-bottom10 > h4').text().includes('UAE')) {
        addButtonWithResult("#uaeBtn1", "Buy Camels!", 129);
        addButtonWithResult("#uaeBtn2", "Buy Tribulus Omanense!", 130);

    } else if ($('div.content-title.m-bottom10 > h4').text().includes('Africa')) {
        addButtonWithResult("#afrBtn1", "Buy African Violets!", 47);
        addButtonWithResult("#afrBtn2", "Buy Lions!", 46);
        addButtonWithResult("#afrBtn3", "Buy Grenades!", 42);
        addButtonWithResult("#afrBtn4", "Buy Xanax!", 173);
    }

})();
