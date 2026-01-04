// ==UserScript==
// @name         wallex
// @namespace    https://wallex.ir/
// @version      0.2.1
// @description  wallex!
// @author       amiwrpremium
// @match        https://wallex.ir/app/trade/btc-tmn
// @match        https://wallex.ir/app/trade/eth-tmn
// @match        https://wallex.ir/app/trade/bch-tmn
// @match        https://wallex.ir/app/trade/ltc-tmn
// @match        https://wallex.ir/app/trade/dash-tmn
// @match        https://wallex.ir/app/trade/usdt-tmn
// @icon         https://www.google.com/s2/favicons?domain=wallex.ir
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425559/wallex.user.js
// @updateURL https://update.greasyfork.org/scripts/425559/wallex.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ <CONSTANT AND SHIT> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    const config = {attributes: true, childList: true, subtree: true};
    // const buy_sell_config = {attributes: true, childList: true, subtree: true, characterData:true};
    //
    // const lowest_sell = document.getElementById('lo-pr-su')
    // const highest_buy = document.getElementById('ma-pr-su')

    const sell_value = document.getElementById('sell_value')
    const sell_price = document.getElementById('sell_price')

    const buy_value = document.getElementById('buy_value')
    const buy_price = document.getElementById('buy_price')

    function lastDigit(str){
        return Number(str.toString().split('').pop())
    }

    function minus_one(num){
        return String(num).slice(0, -1) + String(lastDigit(num)-1);
    }

    function plus_one(num){
        return String(num).slice(0, -1) + String(lastDigit(num)+1);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ </CONSTANT AND SHIT> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ <CHANGE INPUTS> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // sell_value.type = 'number'
    // buy_value.type = 'number'
    // sell_price.type = 'number'
    // buy_price.type = 'number'
    //
    // sell_value.min = '0'
    // buy_value.min = '0'
    // sell_price.min = '0'
    // buy_price.min = '0'
    //
    // sell_value.max = '999999999999999999'
    // buy_value.max = '999999999999999999'
    // sell_price.max = '999999999999999999'
    // buy_price.max = '999999999999999999'

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ </CHANGE INPUTS> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ <SELLER BUTTON> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    function seller_paste_copy_value(count, price) {
        // sell_value.value = count;
        sell_price.value = price;
    }

    function sellerAddButtons() {

        let rows = document.querySelectorAll('#sellers-table > tbody > tr');

        if (document.querySelectorAll('#sellers-table > thead > tr > th').length === 3){
            let tr = document.getElementById('sellers-table').tHead.children[0], th = document.createElement('th');
            th.innerHTML = "Copy - 1";
            tr.appendChild(th);
        }

        if (document.querySelectorAll('#sellers-table > tbody > tr:nth-child(1) > td').length === 3) {
            for (let index = 0; index < 5; index++) {
                let btn2 = rows[index].insertCell(-1);
                btn2.innerHTML = `<button id="seller-row${index}-1" class="${index}" type="button" style='color: #fff; background-color: #FF005D; border-color: #FF005D; border-width: 0; border-radius: 5px; box-shadow: 0 2px 4px 0 rgba(0,0,0,.5);' >Copy</button>`

                document.getElementById(`seller-row${index}-1`).addEventListener('click', function () {
                    let rows = document.querySelectorAll('#sellers-table > tbody > tr');
                    let nice_data = rows[index].getElementsByTagName('td');
                    let nice_count = minus_one(nice_data[0].innerText);
                    let nice_price = Number(nice_data[1].innerText.replace(/,/g, "")) - 1;
                    seller_paste_copy_value(nice_count, nice_price)
                })

            }
        }
    }

    sellerAddButtons();

    const seller_callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                sellerAddButtons()
                console.warn('A child node has been added or removed at [seller table].');
            } else if (mutation.type === 'attributes') {
                sellerAddButtons()
                console.warn('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };
    const seller_observer = new MutationObserver(seller_callback);
    seller_observer.observe(document.querySelector('#sellers-table'), config);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ </SELLER BUTTON> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ <BUYER BUTTON> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    function buyer_paste_copy_value(count, price) {
        // buy_value.value = count;
        buy_price.value = price;
    }

    function buyerAddButtons() {
        let rows = document.querySelectorAll('#buyers-table > tbody > tr');

        if (document.querySelectorAll('#buyers-table > thead > tr > th').length === 3){
            let tr = document.getElementById('buyers-table').tHead.children[0], th = document.createElement('th');
            th.innerHTML = "Copy + 1";
            tr.appendChild(th);
        }

        if (document.querySelectorAll('#buyers-table > tbody > tr:nth-child(1) > td').length === 3) {
            for (let index = 0; index < 5; index++) {
                let btn2 = rows[index].insertCell(-1);
                btn2.innerHTML = `<button id="buyers-row${index}-1" class="${index}" type="button" style='color: #fff; background-color: #0DDAC4; border-color: #0DDAC4; border-width: 0; border-radius: 5px; box-shadow: 0 2px 4px 0 rgba(0,0,0,.5);' >Copy</button>`

                document.getElementById(`buyers-row${index}-1`).addEventListener('click', function () {
                    let rows = document.querySelectorAll('#buyers-table > tbody > tr');
                    let nice_data = rows[index].getElementsByTagName('td');
                    let nice_count = plus_one(nice_data[0].innerText);
                    let nice_price = Number(nice_data[1].innerText.replace(/,/g, "")) + 1;
                    buyer_paste_copy_value(nice_count, nice_price)
                })

            }
        }
    }

    buyerAddButtons();

    const buyer_callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                buyerAddButtons()
                console.warn('A child node has been added or removed at [buyers table].');
            } else if (mutation.type === 'attributes') {
                buyerAddButtons()
                console.warn('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };
    const buyer_observer = new MutationObserver(buyer_callback);
    buyer_observer.observe(document.querySelector('#buyers-table'), config);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ </BUYER BUTTON> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ <LOWEST SELL> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // function lowSellPaste(price){
    //     sell_price.value = price;
    // }
    //
    // const lowest_sell_callback = function (mutationsList, observer) {
    //     for (const mutation of mutationsList) {
    //         lowSellPaste(lowest_sell.innerText)
    //     }
    // };
    // const lowest_sell_observer = new MutationObserver(lowest_sell_callback);
    // lowest_sell_observer.observe(lowest_sell, buy_sell_config);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ </LOWEST SELL> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ <HIGHEST BUY> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // function highBuyPaste(price){
    //     buy_price.value = price;
    // }
    //
    // const highest_buy_callback = function (mutationsList, observer) {
    //     for (const mutation of mutationsList) {
    //         highBuyPaste(highest_buy.innerText)
    //     }
    // };
    // const highest_buy_observer = new MutationObserver(highest_buy_callback);
    // highest_buy_observer.observe(highest_buy, buy_sell_config);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [ </HIGHEST BUY> ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

})();
