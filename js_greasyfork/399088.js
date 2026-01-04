// ==UserScript==
// @name         AmazonBot2
// @namespace    fufuying@lihkg
// @version      9.2.9
// @description  :)
// @author       fufuying@lihkg
// @match        https://www.amazon.co.jp/*
// @downloadURL https://update.greasyfork.org/scripts/399088/AmazonBot2.user.js
// @updateURL https://update.greasyfork.org/scripts/399088/AmazonBot2.meta.js
// ==/UserScript==
(async function () {
    'use strict';

    /*=============Version========================
    1.0: 發行
    2.0: 購物車自動購買
    3.0: 加入move to cart 列表
    4.0: 加入add-on 購買功能
    5.0: 改善部份代碼
    6.0: 加入有貨提示及完成購買音效
    7.0: 自動搜尋所有sfl item id.
    8.0: 防止只購買add-on
    9.0: log
    9.0.5: minor fix
    9.0.6: update product url
    9.0.9: minor fix
    9.1.0: fix cart issue
    9.1.1: change add on item
    9.2.1: enhance product list
    ==============================================
    */


    const refresh_interval = 2500;
    const max_price = 70000;
    const min_checkout = 1699;
    const min_checkout2 = 1518;
    const password = '2007116tsh';
    const addon_href =
        'https://www.amazon.co.jp/gp/item-dispatch/?registryItemID.1=I3MNYS52EM8LZC&offeringID.1=mADLZpYzryDPdebPBoNYmSKpOlzAeR%252B7O2U3IXeFXKMN11T4O9LmF2T9PncepvmCWfp8njzwmRyyyPWKNt5DuVM%252BLotp0VXGeBUqnwYbVvflqMGNC9DAb%252FX3QLVDpQZN6nAAI3mdDtJKe7evOtiimFbEDsLKl2hYeZRBlt56DEhiDI%252BRgR6hvw%253D%253D&session-id=358-8197393-6012867&isGift=0&submit.addToCart=1&quantity.1=1&ref_=lv_ov_lig_pab';
    const current_url = location.href;
    const product_url = "https://www.amazon.co.jp/gp/product/";

    let isAddon = false;



    let product_id = sessionStorage.getItem('id');
    let product_name = sessionStorage.getItem('name');
    let cart_price = sessionStorage.getItem('price');
    let product_offer_list_url = `https://www.amazon.co.jp/gp/offer-listing/${product_id}/ref=olp_f_primeEligible?tag=maftracking91337-22&linkCode=ure&creative=6339&ie=UTF8&f_new=true&f_freeShipping=true&me=AN1VRQENFRJN5`;
    let product_page_url = `https://www.amazon.co.jp/gp/product/${product_id}/?tag=maftracking91337-22&linkCode=ure&creative=6339&smid=AN1VRQENFRJN5`;
    let cart_url = 'https://www.amazon.co.jp/gp/cart/view.html/ref=ord_cart_shr?app-nav-type=none&dc=df';














    const product_ids = [
        //白元: 2626, 1313, 60
        'B07ZSH227P', 'B07MJKHYDC', 'B0141ZPO1E',
        //三次元: 12*3, 12*5, 30
        'B01N2T2PB9', 'B01NAICXSR', 'B07H6BBR55',
        //BMC: 997
        'B07571223K',
        //SmartBasic: 200中 , 200大
        'B07YV7YGXG', 'B07YV93GNH',
        //Presto: 1539藍, 1539綠, 1636藍, 1636綠
        'B07YY9T1FQ', 'B07WW69X1P', 'B07YY9Q6LK', 'B07T3MNKKW',
        //Comdia: 150
        'B07YXX6SJF',
        //快適W: 120男, 200男, 120女
        'B074KBQXNW', 'B074KG65R9', 'B074KB4DJ9',
        //3M
        'B0148D25Z2',
        //超快適: 50男, 30男
        'B07VBM91JB', 'B014IDNTWK',
        //竹虎: 藍, 白, 綠
        'B00FX4EBS0', 'B0015R1BL4', 'B00FX4ECCK','B07XV8VSZT', 'B084HPMVNN'


    ];


    const prefix = 'submit.move-to-cart.'


    function beep(type) {
        var snd;
        if (type == "instock") {
            snd = new Audio("https://ecfun.org/sounds/instock.mp3");
        } else if (type == "cart") {
            snd = new Audio("https://ecfun.org/sounds/cart.mp3");
        }else {
            snd = new Audio("https://ecfun.org/sounds/success.mp3");
        }
        snd.play();
    }

    function console_save(name, code, price, remark) {

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "https://ecfun.org/log.php?name=" + name + "&code=" +
            code + "&remark=" + remark + "&price=" + price, true);
        xmlHttp.send();
    }



    async function reload() {
        const current_page_type = sessionStorage.getItem('current_page_type');
        await sleep(refresh_interval);
        if (current_page_type == 'product') {
            location.replace(product_offer_list_url);
        } else if (current_page_type == 'offer_list') {
            location.replace(product_page_url);
        }  else {
            location.reload(true);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isSoldByAmazon() {
        try {
            const current_page_type = sessionStorage.getItem('current_page_type');
            if (current_page_type == 'product') {
                return document.getElementById('merchant-info').children[0].innerText == 'Amazon.co.jp';
            } else if (current_page_type == 'offer_list') {
                return document.getElementsByClassName('olpSellerName')[0].getElementsByTagName('img')[0].alt == 'Amazon.co.jp';
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    function getPrice() {
        try {
            return Number(document.getElementsByClassName('olpOfferPrice')[0].innerText.replace(/(\D+)/g, ''));
        } catch (e) {
            return -1;
        }
    }
    if (current_url.match('/bot')) {
        for (const _product_id of product_ids) {
            window.open(`https://www.amazon.co.jp/gp/offer-listing/${_product_id}`, _product_id, "height=500,width=516");
        }
        window.open(cart_url, 'cart', "height=500,width=516");
        document.getElementsByClassName('sans')[0].innerHTML = 'Bot has started successfully';
    } else if (current_url.match('/gg1189')) {
        window.open(cart_url, 'cart');
    } else if (current_url.match('/signin*')) {
        document.getElementById('ap_password').value = password;
        document.getElementById('signInSubmit').click();
    } else if (current_url.match('/offer-listing/*')) {
        const product_id = current_url.substring('https://www.amazon.co.jp/gp/offer-listing/'.length, 'https://www.amazon.co.jp/gp/offer-listing/'.length + 10);
        const product_name = document.querySelector("#olpProductDetails > h1").innerText;
        sessionStorage.setItem('id', product_id);
        sessionStorage.setItem('name', product_name);
        sessionStorage.setItem('current_page_type', 'offer_list');
        if (product_ids.includes(product_id)) {
            if (isSoldByAmazon()) {
                const price = getPrice();
                console_save(product_name, product_id, price, product_id + " is now available in offer list");
                if (price > 0 && price < max_price) {
                    document.getElementsByName('submit.addToCart')[0].click();
                    console_save(product_name, product_id, price, product_id + " Trying to add product to cart.....");
                } else {
                    reload();
                }
            } else {
                console.log('out of stock');
                reload();
            }
        }
    } else if (current_url.match('/product/*')) {
        sessionStorage.setItem('current_page_type', 'product');
        if (product_ids.includes(product_id)) {
            const one_click_btn = document.getElementById('oneClickBuyButton');
            const buy_now_btn = document.getElementById('buy-now-button');
            const add_to_cart_btn = document.getElementById('add-to-cart-button');


            if (isSoldByAmazon()) {

                beep("instock");
                const log_price = document.querySelector("#price_inside_buybox").innerText.replace(/(\D+)/g, '');
                console_save(product_name, product_id, log_price, product_id + " is now available in product page");

                if (one_click_btn) {
                    one_click_btn.click();
                } else if (buy_now_btn) {
                    buy_now_btn.click();
                } else if (add_to_cart_btn) {
                    add_to_cart_btn.click();
                } else {
                    reload();
                }
            } else {
                console.log('out of stock');
                reload();
            }
        }

    } else if (current_url.match('/buy/payselect/handlers/*')) {
        document.getElementsByName('ppw-widgetEvent:SetPaymentPlanSelectContinueEvent')[0].click();
    } else if (current_url.match('/buy/spc/handlers/*')) {
        const total_price = document.querySelector("#spc-form-inputs > input[name=purchaseTotal]").value;
        sessionStorage.setItem('price', total_price);

        //if (total_price >= min_checkout && total_price <= min_checkout2) {
        if (total_price == min_checkout) {
            //console_save(product_name, product_id, "", "Failed! the qty of requested item is 0!");
            location.replace(cart_url);
        } else {
            document.getElementsByName('placeYourOrder1')[0].click();

            var json = document.getElementsByClassName('sd_data')[0].innerText;
            var obj = JSON.parse(json);
            var getCode = obj.items.itemData.asin;
            var getName = document.getElementsByClassName('asin-title');

            var name = "";
            var code = "";

            for (var i = 0; i < getName.length; i++ )
            {
                name += getName[i].innerText;
                name += "<br>";
                code += getCode[i];
                code += "<br>";
            }

            console_save(name, code, total_price, "Trying to place order.....");
        }

    } else if (current_url.match('/huc/view.html')) {
        document.getElementById('hlb-ptc-btn-native').click();
        window.close();
    } else if (current_url.match('/item-dispatch/*')) {
        const add_on = document.getElementsByName("submit.addToCart")[0].click();
        const chk_out = document.getElementById('hlb-ptc-btn-native').href;

        if (add_on) {
            add_on.click();
        } else if (chk_out) {
            location.replace(chk_out);
        } else {
            reload();
        }
    } else if (current_url.match('/buy/addressselect/*')) {
        var default_address = document.querySelector("#address-book-entry-0 > div.ship-to-this-address.a-button.a-button-primary.a-button-span12.a-spacing-medium > span > a")
        if (default_address) {
            default_address.click();
        } else {
            document.getElementsByClassName('ship-to-this-address')[0].click();
        }

    } else if (current_url.match('/buy/shipoptionselect/*')) {
        document.getElementsByClassName('sosp-continue-button')[0].click();
    } else if (current_url.match('/cart/view.html')) {
        const current_page_type = sessionStorage.getItem('current_page_type');

        var chk_out = document.getElementsByName('proceedToRetailCheckout')[0];

        if (chk_out) {
            var total = document.querySelector("#sc-subtotal-amount-buybox > span").innerText.replace(/(\D+)/g, '');
            if (total != min_checkout) {
                chk_out.click();
            } else {
                reload();
            }
        } else {
            reload();
        }



        var expand_sfl = document.getElementsByName("submit.expand-saved-for-later")[0];
        if (expand_sfl) {
            expand_sfl.click();
        }

        var addon_item = document.getElementsByName('continueShopping')[0];
        if (addon_item ) {
            if (!isAddon) {
                isAddon = true;
                console_save("", "", "", "Add-on item detected!! Need to add another items to place order");
                window.open(addon_href, 'addon', "height=500,width=516");
            }

        }


        var sfl_total = document.querySelectorAll("#sc-saved-cart-items")[0].children;

        for (var sfl_item=0; sfl_item < sfl_total.length; sfl_item++){
            var cartItem = sfl_total[sfl_item].getAttribute("data-itemid").toString();
            var cartCode = sfl_total[sfl_item].getAttribute("data-asin").toString();
            var cartPrice = sfl_total[sfl_item].getAttribute("data-price").toString();
            var cartName = document.querySelector("#sc-item-" + cartItem + " > div.sc-list-item-content > div > div.a-column.a-span10 > div > div > div.a-fixed-left-grid-col.a-col-right > ul > li:nth-child(1) > span > a > span").innerText;
            var getItem = document.getElementsByName(prefix + cartItem)[0];

            if (getItem) {
                getItem.click();
                console_save(cartName, cartCode, cartPrice, "Cart detected!!");
                beep("cart");
            }

        }



    } else if (current_url.match('/buy/thankyou/*')) {
        isAddon = false;

        var url = new URL(current_url);
        var code2 = url.searchParams.get("asins");
        var orderId = url.searchParams.get("orderId");
        var name2 = document.querySelector("#a-page > div.a-container.containerCSS > div.a-row.a-spacing-base > div > div > div > div > div.a-column.a-span7 > ul > li > span > span.wrap-item-title").innerText

        console_save(name2, code2, cart_price, "Successfully place order! Order ID: " + orderId);

        beep();
        reload();
    } else if (current_url.match('/buy/itemselect/handlers/*')) {
        reload();
    } else if (current_url.match('/gp/yourstore*')) {
        reload();
    } else if (current_url.match('/buy/error/handlers/*')) {
        reload();
    } else if (current_url.match('/cart/desktop/go-to-checkout.html/*')) {
        reload();
    }

})();