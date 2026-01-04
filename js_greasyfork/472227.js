// ==UserScript==
// @name         SberHELP+
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  Helper for sbermarket
// @author       You
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_cookie
// @grant        unsafeWindow
// @sandbox      JavaScript
// @match        https://sbermarket.ru/checkout/order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sbermarket.ru
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472227/SberHELP%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/472227/SberHELP%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function rc(arr) {
        return arr[Math.floor(arr.length * Math.random())];
    }
    function repl(txt) {
        var arr = txt.split('')
        var output = ''
        arr.forEach(sym => {
            switch (sym) {
                case '0':
                    output += rc(['߀', '᱐'])
                    break
                case '1':
                    output += rc(['１'])
                    break
                case '2':
                    output += rc(['２'])
                    break
                case '3':
                    output += rc(['３'])
                    break
                case '4':
                    output += rc(['４'])
                    break
                case '5':
                    output += rc(['５'])
                    break
                case '6':
                    output += rc(['６'])
                    break
                case '7':
                    output += rc(['７'])
                    break
                case '8':
                    output += rc(['৪', '８'])
                    break
                case '9':
                    output += rc(['９'])
                    break
                case '#':
                    output += rc(['#'])
                    break
                default:
                    output += sym
            }
        })
        return output
    }
    function addClick(elem, txt) {
        try {
            elem.setAttribute('alt', txt)
            elem.onclick = function (e) { e.target.value = ""; e.target.textContent = ""; GM_setClipboard(e.target.getAttribute('alt')); }
        }
        catch { }
    }
    function generateEmail() {
        const domain = "rambler.ru";
        const randomStringLength1 = Math.floor(Math.random() * (15 - 8 + 1) + 8);
        const randomStringLength2 = Math.floor(Math.random() * (20 - 10 + 1) + 10);
        const randomString1 = Math.random().toString(36).substring(2, 2 + randomStringLength1);
        const randomString2 = Math.random().toString(36).substring(2, 2 + randomStringLength2);
        const randomNumber = Math.floor(Math.random() * (9999 - 10 + 1) + 10);
        const email = `${randomString1}.${randomString2}.${randomNumber}@${domain}`;
        return email;
    }
    const email = generateEmail();
    function autoFill() {
        const someKey = GM_getValue("promo", "");
        const promoform = byclass("Input_root__xROBM FormGroup_input__H6r_Q PromoCode_input__b7H0S")
        promoform.setAttribute('autocomplete', 'on')
        //addClick(promoform,someKey)
        const butt = byclass('Button_root__WicTg Button_default__fTaqt Button_secondary__f4KOQ Button_smSize__FV_id CheckoutButton_root__holGG PromoCode_button__ybZoC')
        if (butt) {
            butt.onpointerenter = () => { GM_setValue('promo', promoform.value) }
        }
        addClick(byname('phone'), '79169456184')
    }
    var intervalId = window.setInterval(autoFill, 500);
    function byname(name) {
        return document.getElementsByName(name)[0];
    }
    function byid(name) {
        return document.getElementById(name);
    }
    function byclass(name) {
        return document.getElementsByClassName(name)[0];
    };
    const num_order = JSON.parse(document.querySelector("#__NEXT_DATA__").innerText).props.pageProps.order.shipments[0].number
    const num_api = JSON.parse(document.querySelector("#__NEXT_DATA__").innerText).props.pageProps.order.number
    const addr_id = JSON.parse(document.querySelector("#__NEXT_DATA__").innerText).props.pageProps.order.address.id
    const client_token = unsafeWindow.dynamicEnvsFromServer.STOREFRONT_API_V3_CLIENT_TOKEN
    const next_deliv = JSON.parse(document.querySelector("#__NEXT_DATA__").innerText).props.pageProps.order.shipments[0].store.nextDelivery.id
    console.log({
        "id": addr_id,
        "apartment": repl('140'),
        "entrance": repl('3'),
        "floor": repl('3'),
        "door_phone": repl("#192#2536"),
        "comments": repl("3B0HИTЬ HA H0MEP: 79150102710"),
    })
    function fill_fetch() {
        fetch("https://sbermarket.ru/api/v3/loyalties/magnit_loyalty/retailer_cards", {
            "headers": {
                "client-token": client_token,
                "content-type": "application/json;charset=UTF-8",
            },
            "body": "{\"magnit_card_number\":\"7000001544399747\"}",
            "method": "POST",
        })
        fetch(`https://sbermarket.ru/api/v3/checkout/orders/${num_api}`, {
            "headers": {
                "client-token": client_token,
                "content-type": "application/json;charset=UTF-8",
            },
            "body": JSON.stringify({
                "order": {
                    "phone": "79161597113",
                    "address_attributes": {
                        "id": addr_id,
                        "apartment": '-',
                        "entrance": '-',
                        "floor": '-',
                        "door_phone": "-",
                        "comments": "АДРЕС: 3-я Карачаровская, 9к3, 3 подъезд, 3 этаж, кв 140, домофон #192#2536. ПОДОБРАТЬ ЗАМЕНУ ПО ЦЕНЕ НЕ МЕНЬШЕ ЧЕМ БЫЛО",
                    },
                    "shipments_attributes": [{
                        "number": num_order,
                        "delivery_window_id": next_deliv
                    }],
                    "payment_attributes": {
                        "payment_tool_id": 1532252,
                        "benefit_amount": null
                    },
                    "company_document_id": null,
                    "replacement_policy_id": 1,
                    "email": email,
                },
                "shipment_numbers": [num_order]
            }),
            "method": "PUT"
        }).then(resp => {
            if (true) {
                fetch(`https://sbermarket.ru/api/v3/checkout/orders/${num_api}/promotions`, {
                    "headers": {
                        "client-token": client_token,
                        "content-type": "application/json;charset=UTF-8",
                    },
                    "body": JSON.stringify({
                        "promotion_code": GM_getValue("promo", ""),
                        "shipment_numbers": [num_order]
                    }),
                    "method": "POST"
                }).then(resp => {
                    if (true) {
                        sessionStorage.setItem("filled", true);
                        window.location.reload();
                    }
                })
            }
        })
    }
    if (!sessionStorage.getItem("filled")) {
        fill_fetch()
    }
})();