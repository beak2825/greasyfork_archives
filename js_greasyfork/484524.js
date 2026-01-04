// ==UserScript==
// @name         Torn Item Market Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Highlight items in the item market/bazaars that are at or below Arson Warehouse Pricelist
// @author       You
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/484524/Torn%20Item%20Market%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/484524/Torn%20Item%20Market%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle ( `
    .awh_highlight {
        color: magenta !important;
    }
    .awh_highlight_eq {
        color: pink !important;
    }
` );

    let item_prices = {};
    let items_json = GM_getValue("AWH_Prices", "");

    if (items_json.length > 0) {
        try {
            item_prices = JSON.parse(items_json);
        }
        catch (e) {
        }
    }

    let check_price_timer;
    let look_for_items_timer;

    let current_item = 0;

    GM_registerMenuCommand('Add Torn Player ID', () => {
        let torn_id = GM_getValue("AWH_TornID", "");
        torn_id = prompt("Enter your Torn Player ID", torn_id);
        if (torn_id) {
            GM_setValue("AWH_TornID", torn_id);
        }
    });

    GM_registerMenuCommand('Add AWH API key', () => {
        let AWH_Key = GM_getValue("AWH_Key", "");
        AWH_Key = prompt("Enter your AWH API key", AWH_Key);
        if (AWH_Key) {
            GM_setValue("AWH_Key", AWH_Key);
        }
    });

    GM_registerMenuCommand('Get AWH Prices', () => {
        getAWHPrices();
    });

    function getAWHPrices() {
        let AWH_Key = GM_getValue("AWH_Key", "");
        let torn_id = GM_getValue("AWH_TornID", "");

        if (AWH_Key && AWH_Key.length > 0 && torn_id && torn_id.length > 0) {
            item_prices = {};
            AWHPriceLoop(AWH_Key, torn_id);
        }
    }

    function AWHPriceLoop(key, torn_id) {
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://arsonwarehouse.com/api/v1/bids/${torn_id}`,
            headers: {
                "Authorization": "Basic " + btoa(key + ':')
            },
            onload: function(response) {
                try {
                    let items = JSON.parse(response.responseText);

                    if (items.bids && items.bids.length > 0)
                    {
                        for (let i = 0; i < items.bids.length; i++)
                        {
                            if (items.bids[i].item_id && items.bids[i].bids && items.bids[i].bids.length > 0)
                            {
                                if (items.bids[i].bids[0].price)
                                {
                                    item_prices[items.bids[i].item_id] = items.bids[i].bids[0].price;
                                }
                                else
                                {
                                    item_prices[items.bids[i].item_id] = 0;
                                }
                            }
                        }
                    }
                    GM_setValue("AWH_Prices", JSON.stringify(item_prices));
                    alert('Prices updated.');
                }
                catch (e) {
                    alert('Ran across an issue updating prices.');
                }
            }
        });
    }

    if (document.URL.startsWith("https://www.torn.com/imarket.php")) {
        // On the item market or a bazaar
        let observeNode = document.getElementById('item-market-main-wrap');

        const config = { attributes: false, childList: true, subtree: true };

        let reactObserver = new MutationObserver(lookForItems);
        reactObserver.observe(observeNode, config);
    } else if (document.URL.startsWith("https://www.torn.com/bazaar.php")) {
        let observeNode = document.getElementById('bazaarRoot');

        const config = { attributes: false, childList: true, subtree: true };

        let reactObserver = new MutationObserver(lookForItemsBazaar);
        reactObserver.observe(observeNode, config);
    }

    function lookForItemsByID() {

    }

    function lookForItemsBazaar() {
        const minprice_regex = /\$([0-9,]+)/g;

        for (const [key, value] of Object.entries(item_prices)) {
            let elem = document.querySelector(`img[src="/images/items/${key}/large.png"]`);

            if (elem) {
                if (elem.parentElement && elem.parentElement.parentElement && elem.parentElement.parentElement.parentElement)
                {
                    let price_compare = value;//0;

                    let price = elem.parentElement.parentElement.parentElement.querySelector('[class*="price_"]');

                    if (price && !price.classList.contains('awh_highlight')) {
                        const reg_res = [...price.innerText.matchAll(minprice_regex)];

                        if (reg_res.length > 0 && reg_res[0].length > 1) {
                            let minimum_price = parseInt(reg_res[0][1].replace(/,/g, ''));
                            if (minimum_price < price_compare) {
                                price.classList.add('awh_highlight');
                                price.parentElement.classList.add('awh_highlight');
                            }
                            else if (minimum_price === price_compare) {
                                price.classList.add('awh_highlight_eq');
                                price.parentElement.classList.add('awh_highlight_eq');
                            }
                        }
                    }
                }
            }
        }
    }

    function lookForItems() {
        const minprice_regex = /\$([0-9,]+)/g;
        const id_regex = /^https:\/\/www.torn.com\/imarket.php#\/p=shop&type=([0-9]+)/;

        const id_match = document.URL.match(id_regex);
        let item_id = 0

        if (id_match && id_match.length > 1)
        {
            item_id = id_match[1];
        }

        if (item_id !== 0) {
            if (item_prices[item_id])
            {
                let elems = document.querySelectorAll(`img[src="/images/items/${item_id}/large.png"]`);

                elems.forEach((elem) => {
                    if (elem.parentElement && elem.parentElement.parentElement && elem.parentElement.parentElement.parentElement)
                    {
                        let price_compare = item_prices[item_id];

                        let price = elem.parentElement.parentElement.parentElement.querySelector('[class*="price"]');

                        if (price && !price.classList.contains('awh_highlight')) {
                            const reg_res = [...price.innerText.matchAll(minprice_regex)];

                            if (reg_res.length > 0 && reg_res[0].length > 1) {
                                let minimum_price = parseInt(reg_res[0][1].replace(/,/g, ''));
                                if (minimum_price < price_compare) {
                                    price.classList.add('awh_highlight');
                                    price.parentElement.classList.add('awh_highlight');
                                }
                                else if (minimum_price === price_compare) {
                                    price.classList.add('awh_highlight_eq');
                                    price.parentElement.classList.add('awh_highlight_eq');
                                }
                            }
                        }
                    }
                });

                let list_elems = document.querySelectorAll('div.items-list ul.items li.show-item-info ul.item li.cost');

                list_elems.forEach((elem) => {
                    let price_compare = item_prices[item_id];

                    if (elem && !elem.classList.contains('awh_highlight')) {
                        const reg_res = [...elem.innerText.matchAll(minprice_regex)];

                        if (reg_res.length > 0 && reg_res[0].length > 1) {
                            let minimum_price = parseInt(reg_res[0][1].replace(/,/g, ''));
                            if (minimum_price < price_compare) {
                                elem.classList.add('awh_highlight');
                            }
                            else if (minimum_price === price_compare) {
                                elem.classList.add('awh_highlight_eq');
                            }
                        }
                    }
                });
            }
        }
        else {
            for (const [key, value] of Object.entries(item_prices)) {
                let elem = document.querySelector(`.torn-divider[data-item="${key}"]`);
                if (elem) {
                    let price_compare = value;//0;

                    let minprice = elem.querySelector('.minprice');

                    if (minprice && !minprice.classList.contains('awh_highlight')) {
                        const reg_res = [...minprice.innerText.matchAll(minprice_regex)];

                        if (reg_res.length > 0 && reg_res[0].length > 1) {
                            let minimum_price = parseInt(reg_res[0][1].replace(/,/g, ''));
                            if (minimum_price < price_compare) {
                                minprice.classList.add('awh_highlight');
                                minprice.parentElement.classList.add('awh_highlight');
                            }
                            else if (minimum_price === price_compare) {
                                minprice.classList.add('awh_highlight_eq');
                                minprice.parentElement.classList.add('awh_highlight_eq');
                            }
                        }
                    }

                    let buy_button = document.querySelector(`.hover[itemid="${key}"] .buy-info`);//document.querySelector(`.hover[itemid="${ITEMS[i]}"] .buy-info`);

                    if (buy_button && buy_button.getAttribute('awh_highlight_listener') !== 'true') {
                        buy_button.setAttribute('awh_highlight_listener', 'true');
                        buy_button.addEventListener("click", function(e) {
                            current_item = key;//ITEMS[i];
                        });
                    }
                }
            }
            if (current_item > 0)
            {
                let elems1 = document.querySelectorAll('.buy-item-info-wrap .items .private-bazaar .item .cost .cost-price');
                let elems2 = document.querySelectorAll('.buy-item-info-wrap .items .item .cost');

                let elems = [...elems1, ...elems2];

                if (elems) {
                    let price_compare = 0;

                    if (item_prices[current_item]) {
                        price_compare = item_prices[current_item];
                    }
                    for (let i = 0; i < elems.length; i++)
                    {
                        if (elems[i] && !elems[i].classList.contains('awh_highlight')) {
                            const reg_res = [...elems[i].innerText.matchAll(minprice_regex)];

                            if (reg_res.length > 0 && reg_res[0].length > 1) {
                                let minimum_price = parseInt(reg_res[0][1].replace(/,/g, ''));
                                if (minimum_price < price_compare) {
                                    elems[i].classList.add('awh_highlight');
                                }
                                else if (minimum_price === price_compare) {
                                    elems[i].classList.add('awh_highlight_eq');
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})();