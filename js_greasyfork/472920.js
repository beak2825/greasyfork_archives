// ==UserScript==
// @name         shashumga 3000
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shashumga 3000 buff autobuy
// @author       You
// @match        https://buff.163.com/goods/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472920/shashumga%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/472920/shashumga%203000.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let amountBought = 0

    const req = (sell_order_id, goods_id, price) => {
        axios({
            method: 'post',
            url: 'https://buff.163.com/api/market/goods/buy',
            data: {
                "game":"csgo",
                "goods_id":goods_id,
                "sell_order_id":sell_order_id,
                "price":price,
                "pay_method":3,
                "allow_tradable_cooldown":0,
                "token":"",
                "cdkey_id":""
            },
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
                "Accept-Encoding": "gzip, deflate, br",
                "Content-Type": "application/json",
                "X-CSRFToken": localStorage.getItem("csrf"),
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://buff.163.com",
                "Connection": "keep-alive",
                "Referer": `https://buff.163.com/goods/${goods_id}`,
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            withCredentials: true // This ensures cookies are sent with the request
        })
            .then(response => {
            if(response.data.code === 'OK'){
                console.log(`%c${++amountBought}`, 'font-size: 40px; color: red');
            } else {
                console.log(`error: `, response.data)
            }
        })
            .catch(error => {
            console.error("Error sending request:", error);
        });
    }

    const autobuy = (newCsrf) => {
        newCsrf && localStorage.setItem("csrf", newCsrf)

        let timeout = 0
        document.querySelectorAll('.btn-buy-order').forEach((element) => {
            setTimeout(()=> {
                req(element.getAttribute('data-orderid'), element.getAttribute('data-goodsid'), element.getAttribute('data-price'))
            }, timeout)
            timeout += 750
        })
        setTimeout(()=> {
            location.reload()
        }, timeout + 2000)
    }

    window.autobuy = autobuy
})();