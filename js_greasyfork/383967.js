// ==UserScript==
// @name            Flaschenpost.de Bestpreis Sortierer
// @description     Sortiert Angeboote auf flaschenpost.de nach Bestpreis pro Liter.
// @namespace       https://www.flaschenpost.de
// @version         0.16
// @license         MIT
// @match           https://www.flaschenpost.de/*
// @run-at          document-end
// @icon            https://www.google.com/s2/favicons?sz=64&domain=flaschenpost.de
// @require         https://code.jquery.com/jquery-3.6.3.js
// @downloadURL https://update.greasyfork.org/scripts/383967/Flaschenpostde%20Bestpreis%20Sortierer.user.js
// @updateURL https://update.greasyfork.org/scripts/383967/Flaschenpostde%20Bestpreis%20Sortierer.meta.js
// ==/UserScript==


document.onkeydown = function(evt) {
    console.log('key down');

    evt = evt || window.event;
    if (evt.ctrlKey && evt.keyCode == 66) {
        sortBestpreis();
    }
};

function sortBestpreis() {
    console.log('sort');

    $('.product_group, .articles').each(function() {
        const listElements = $(this).find('.product');

        console.log('listElements', listElements);

        $(listElements).sort(function(a, b) {
            function extract_price(e) {
                const priceElements = $(e).find('.price_per_unit_description');
                const prices = $.map(priceElements, function (e) {
                    const htmlText = $(e).text();
                    console.log('htmlText', htmlText);
                    const regExMatch = htmlText.match(/\(([0-9\,]+) €\//);  // match (_,__ €/___...) Unit can be "L" "Liter" "kg"
                    console.log('regExMatch', regExMatch);
                    return Number.parseFloat(regExMatch[1].replace(',', '.'));
                });

                console.log('prices', prices);
                return Math.min(...prices);
            }

            return extract_price(a) - extract_price(b);
        }).appendTo(this);
    });
}
