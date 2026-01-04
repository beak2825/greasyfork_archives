// ==UserScript==
// @name         QuickTrade v1.0.3
// @namespace    https://www.torn.com/
// @version      1.0.3
// @description  Calculates total trade value based on up-to-date prices from your pricelist (spreadsheet)
// @author       Betrayer [1870130]
// @match        https://www.torn.com/trade.php*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/406040/QuickTrade%20v103.user.js
// @updateURL https://update.greasyfork.org/scripts/406040/QuickTrade%20v103.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const APP_URL = '';
    const QT_KEY = '';

    const CHAT_RECEIPT = false;

    function getPrices() {
        return new Promise((resolve,reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: APP_URL + '?key=' + QT_KEY,
                onload: (response) => {
                    try {
                        var data = JSON.parse(response.response);
                    } catch(e) {
                        return alert('QuickTrade: The APP url and/or QT key you entered in the userscript are incorrect!');
                    }
                    if(data.hasOwnProperty('prices')) {
                        data = data.prices;
                    } else {
                        return alert('QuickTrade: You have entered an invalid QT key! Go to the userscript in Tampermonkey and confirm that the key is correct.');
                    }
                    resolve(data);
                },
                onerror: error => reject(error)
            });
        });
    }

    /* FUNCTION NOT IMPLEMENTED YET !
    function saveToSheet(dataHere) {
        return new Promise((resolve,reject) => {
            GM.xmlHttpRequest({
                method: 'POST',
                url: APP_URL + '?key=' + QT_KEY,
                data: {},
                onload: (response) => { resolve(); },
                onerror: error => { alert('Data could NOT be saved to sheet ! (' + error + ')'); reject(); },
                onabort: error => { alert('Data could NOT be saved to sheet ! (' + error + ')'); reject(); },
                ontimeout: error => { alert('Data could NOT be saved to sheet ! (' + error + ')'); reject(); }
            });
        });
    }
    */

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    function addValueAndProfit(totalBuyPrice, totalProfit, tradeInfo) {
        if($('#qtValue').length > 0) return;

        $('.user.right .color2 > .desc > li:last').removeAttr('class');

        $('.user.right .color2 > .desc').append(`
            <li>
                <div class="name left" style="font-weight:bold;font-size:17px;font-family:'Times New Roman'">
                    Total value: <span id="qtValue" title="Click to copy trade value">$${totalBuyPrice.toLocaleString()}</span>
                </div>
                <div class="del right"></div>
                <div class="clear"></div>
            </li>`);

        $('.user.right .color2 > .desc').append(`
            <li class="last">
                <div class="name left" style="font-style:italic;font-size:16px;font-family:'Times New Roman'">
                    Expected profit: $${totalProfit.toLocaleString()} (${Math.round(totalProfit/totalBuyPrice*100)}%)
                </div>
                <div class="del right"></div>
                <div class="clear"></div>
            </li>`);

        if(CHAT_RECEIPT) {
            $('.user.right .color2 > .desc > li:last').removeAttr('class');

            $('.user.right .color2 > .desc').append(`
            <li class="last">
                <div class="name left" style="font-size:16px;font-weight:bold;font-family:'Times New Roman'">
                    <span id="qtChatReceipt" title="Click to copy chat receipt">Chat Receipt</span>
                </div>
                <div class="del right"></div>
                <div class="clear"></div>
            </li>`);

            $('#qtChatReceipt').on('hover', event => $('#qtChatReceipt').css('cursor', 'pointer'));

            $('#qtChatReceipt').on('click', (event) => {
                let seller_name = $('.user.right > .title-black').text();

                let chatReceipt = `Total payment for ${seller_name} of $${totalBuyPrice.toLocaleString()}= `;

                for(let i=0; i<tradeInfo.items.length; ++i) {
                    let item = tradeInfo.items[i].replace(/(^\w|\s\w)/g, m => m.toUpperCase());
                    let qty = tradeInfo.quantities[i];
                    let unit_price = tradeInfo.unit_prices[i];

                    chatReceipt += `|${item} x${qty} $${unit_price.toLocaleString()}| `;
                }

                let old = $('#qtChatReceipt').css('background-color');

                $('#qtChatReceipt').css('background-color', 'yellow');

                setTimeout(() => {
                    $('#qtChatReceipt').css('background-color', old);
                }, 500);

                copyToClipboard(chatReceipt);
            });
        }

        $('#qtValue').on('hover', event => $('#qtValue').css('cursor', 'pointer'));

        $('#qtValue').on('click', (event) => {
            let old = $('#qtValue').css('background-color');

            $('#qtValue').css('background-color', 'yellow');

            setTimeout(() => {
                $('#qtValue').css('background-color', old);
            }, 500);

            copyToClipboard( $('#qtValue').text().replace('$', '') );
        });

        // Run function to log data to sheet here
        // saveToSheet( ... )
    }

    function addItemTitles(prices) {
        let items = [];
        let quantities = [];
        let unit_prices =  [];
        let total_unit_prices = [];

        let totalBuyPrice = 0;
        let totalProfit = 0;
        $('.user.right .color2 > .desc > li').each((i,j) => {
            const item_str = $(j).find('.name.left').text();
            let item_arr = item_str.split(' ');

            let qty;
            let item;

            if($(j).find('.networth-info-icon').length == 0) { // If not an item with damage/accuracy
                qty = parseInt(item_arr.pop().replace('x', ''));
                item = item_arr.join(' ').toLowerCase().trim();
            } else { // If item with damage/accuracy - the qty will be 1
                qty = 1;
                item = item_str.toLowerCase().trim();
            }

            // Necessary line otherwise my appended elements will read as errors 'does not exist in the pricelist'
            if(item_str.includes('Total') || item_str.includes('Expected') || item_str.includes('Receipt')) return true;

            if(!Object.keys(prices).includes(item)) {
                //alert(`You do NOT have ${item[0].toUpperCase() + item.slice(1)} in your pricelist !`);
                $(j).find('.name.left').css('background-color', 'tomato');
                $(j).attr('title', 'Does not exist in your pricelist!');
                return true;
            }

            if(isNaN(prices[item].buy_price) || prices[item].buy_price == '') {
                 //alert(`You have NO VALID price set for ${item[0].toUpperCase() + item.slice(1)} in your pricelist !`);
                $(j).find('.name.left').css('background-color', 'tomato');
                $(j).attr('title', 'Has no valid price in your pricelist!');
                return true;
            }

            items.push(item[0].toUpperCase() + item.slice(1));
            quantities.push(qty);
            unit_prices.push(prices[item].buy_price);
            total_unit_prices.push(prices[item].buy_price*qty);

            totalBuyPrice += prices[item].buy_price * qty;
            totalProfit += prices[item].profit * qty; // Profit is calculated as market value - buy price. If you know you sell at a % under market price, profit can be re-calculated for that in the spreadsheet script editor !

            $(j).attr('title', `$${prices[item].buy_price.toLocaleString()} x ${qty} = $${(prices[item].buy_price*qty).toLocaleString()}`);
        });

        let tradeInfo = {items, quantities, unit_prices, total_unit_prices};

        addValueAndProfit(totalBuyPrice, totalProfit, tradeInfo);
    }

    function main() {
        if($('.user.right .color2 > .desc').length > 0) {
            getPrices().then((prices) => {
                addItemTitles(prices);
            });
        }

        const observer = new MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if( $('.user.right .color2 > .desc').length > 0) {
                        getPrices().then((prices) => {
                            addItemTitles(prices);
                        });
                    }
                }
            }
        });

        observer.observe($('.content-wrapper.m-left20.left')[0], {childList: true, subtree: true});
    }

    main();

})();