// ==UserScript==
// @name         QuickBazaar
// @namespace    zero.quickbazaar.torn
// @version      0.1
// @description  No confirm bazaar
// @author       You
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470500/QuickBazaar.user.js
// @updateURL https://update.greasyfork.org/scripts/470500/QuickBazaar.meta.js
// ==/UserScript==

// var data = {};

const { fetch: origFetch } = window;
window.fetch = async (...args) => {
    console.log("fetch called with args:", args);

    const response = await origFetch(...args);

    /* work with the cloned response in a separate promise
     chain -- could use the same chain with `await`. */

    if (response.url.includes('/bazaar.php?sid=bazaarData&step=getBazaarItems')) {
        console.log("REsponseL : " + response);

        response
            .clone()
            .json()
            .then(function (body) {
                // var time = body.user.lastAction.seconds;
                // data = body;
                insert(body);
                console.log(body);

            })
            .catch(err => console.error(err))
            ;
    }



    return response;
};

function insert(data) {
    var allItems = $('div[class^="item___"]');
    var responseTextAreaZero = `<span id="responseTextAreaZero"></span>`;
    $('div[class^="titleContainer___"]').append(responseTextAreaZero);

    for (var i = 0; i < data.list.length; i++) {
        (function () {
            var item = $(allItems[i + 1]);
            var user = data.ID;
            var iid = data.list[i].bazaarID;
            var itype = data.list[i].itemID;
            // var amount = 1;
            var amount = amount; // MAX AMOUNT AVAILABLE
            var price = data.list[i].price;

            console.log(price);
            console.log($('div[class^="description"]', $(item)));
            $('div[class^="description"]', $(item)).on('click', function () {

                quickBazaar(user, iid, itype, amount, price);

            });
        })();
    }



}

function quickBazaar(user, iid, itype, amount, price) {
    $.post('https://www.torn.com/bazaar.php?sid=bazaarData&step=buyItem',
        {
            userID: user,
            id: iid,
            itemID: itype,
            amount: amount,
            price: price,
            beforeval: price
        },
        function (response) {
            console.log(response);
            $('#responseTextAreaZero').append(response.text);
            

        });
}
