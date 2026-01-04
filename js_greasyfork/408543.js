// ==UserScript==
// @name            Taobao-fake-price
// @description	    自动修改淘宝页面上游戏的价格为原来的十分之一
// @namespace       Violentmonkey Scripts
// @match           *://*.taobao.com/*
// @grant           none
// @version         1.0
// @author          fnMrRice
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.js
// @date            2002.08.10
// @downloadURL https://update.greasyfork.org/scripts/408543/Taobao-fake-price.user.js
// @updateURL https://update.greasyfork.org/scripts/408543/Taobao-fake-price.meta.js
// ==/UserScript==


$(function () {
    const dec_mul = 10.0;

    const keywords = ['电玩', '游戏(?!机)',];
    const search_keywords = ['马里奥', '塞尔达', 'Switch', 'switch', 'SWITCH', 'NS', 'ns', 'PS', 'ps', '[xX][bB]ox'];
    const item_keywords = ['马里奥', '塞尔达', 'Switch', 'switch', 'SWITCH', 'NS', 'ns', 'PS', 'ps', '[xX][bB]ox'];

    const kreg = new RegExp(keywords.join('|'));
    const sreg = new RegExp(search_keywords.join('|'));
    const ireg = new RegExp(item_keywords.join('|'));

    const domain = window.location.host;

    if (domain === 'item.taobao.com') {
        const item_title = document.getElementsByClassName('tb-main-title')[0].textContent;
        if (item_title.match(ireg)) { // works only if shop name match
            // const shop_name = document.getElementsByClassName('tb-shop-name')[0].textContent;
            // if (shop_name.match(kreg)) { // works only if shop name match
            // item.taobao.com
            // const selector = document.getElementById('J_isku');
            const sel_cont = document.getElementsByClassName('J_Prop tb-prop tb-clear ');
            for (let i = 0; i < sel_cont.length; i++) {
                const elems = sel_cont[i].lastElementChild.firstElementChild.children
                for (let j = 0; j < elems.length; j++) {
                    const elem = elems[j].firstElementChild;
                    elem.addEventListener('click', e => {
                        setTimeout(() => {
                            const prices_container = document.getElementsByClassName('tb-rmb-num');
                            // console.log(prices_container);
                            if (prices_container.length > 0) {
                                // console.log(arr[0].addedNodes[0].firstChild.lastChild.textContent);
                                for (let i = 0; i < prices_container.length; i++) {
                                    const price_div = prices_container[i];
                                    const new_price = price_div.textContent.split('-').map(v => (Number(v) / dec_mul).toFixed(2)).join('-');
                                    console.log(new_price);
                                    price_div.textContent = new_price;
                                }
                                // const price_div = prices_container.firstChild.firstChild.lastChild;
                                // // console.log(price_div);
                                // const new_price = price_div.textContent.split('-').map(v => (Number(v) / dec_mul).toFixed(2)).join('-');
                                // price_div.textContent = new_price;
                            }
                        }, 5);
                    });
                }
            }

            const prices_container = document.getElementsByClassName('tb-rmb-num');
            if (prices_container.length > 0) {
                for (let i = 0; i < prices_container.length; i++) {
                    const price_div = prices_container[i];
                    const new_price = price_div.textContent.split('-').map(v => (Number(v) / dec_mul).toFixed(2)).join('-');
                    console.log(new_price);
                    price_div.textContent = new_price;
                }
            }
        }
    }

    if (domain === 's.taobao.com') {
        // const item_list = document.getElementById('main');
        // console.log(item_list);
        // console.log('changed');
        // s.taobao.com
        // const prices_search_div = document.getElementsByClassName('price g_price g_price-highlight');
        setInterval(() => { // prevent leak of listen event
            const search_result_names = document.getElementsByClassName('ctx-box J_MouseEneterLeave J_IconMoreNew');
            for (let i = 0; i < search_result_names.length; i++) {
                const result_name = search_result_names[i].children[1].textContent.trim(' ');
                if (result_name.match(sreg)) {
                    const price_div = search_result_names[i].children[0].children[0].lastElementChild;
                    if (!price_div.getAttribute('tfgp-changed')) {
                        const new_price = price_div.textContent.split('-').map(v => (Number(v) / dec_mul).toFixed(2)).join('-');
                        price_div.setAttribute('tfgp-changed', true);
                        price_div.textContent = new_price;
                    }
                    // console.log(price_div, result_name);
                }
            }
        }, 500);
        // if (prices_search_div.length !== 0) {
        //     for (let i = 0; i < prices_search_div.length; i++) {
        //         const price_div = prices_search_div[i];
        //         const price = price_div.textContent.split('-').map(v => (Number(v) / dec_mul).toFixed(2)).join('-');
        //         // console.log(price);
        //         price_div.lastElementChild.textContent = price;
        //     }
        // }
    }

    if (domain.indexOf('shop') === 0) {
        const shop_name = document.getElementsByClassName('shop-name-link')[0].textContent;
        // console.log(shop_name);
        const shop_result = document.getElementById('J_ShopSearchResult');
        if (shop_name.match(kreg) && shop_result) {
            // console.log('match');
            const observer = new MutationObserver((arr, obs) => {
                // shop.taobao.com
                const prices_c = document.getElementsByClassName('c-price');
                const prices_s = document.getElementsByClassName('s-price');
                if (prices_c.length !== 0) {
                    for (let i = 0; i < prices_c.length; i++) {
                        const new_price = prices_c[i].textContent.split('-').map(v => (Number(v) / dec_mul).toFixed(2)).join('-');
                        prices_c[i].textContent = new_price;
                    }
                }
                if (prices_s.length !== 0) {
                    for (let i = 0; i < prices_s.length; i++) {
                        const new_price = prices_s[i].textContent.split('-').map(v => (Number(v) / dec_mul).toFixed(2)).join('-');
                        prices_s[i].textContent = new_price;
                    }
                }
            });
            const observe_options = {
                childList: true,
                characterData: true,
                attribute: true,
            }
            observer.observe(shop_result, observe_options);
        }
    }
});