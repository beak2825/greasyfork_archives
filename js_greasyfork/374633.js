// ==UserScript==
// @name        Cashback Reminder Enhanced
// @description A reminder to check for cashback before completing a purchase online.
// @namespace   Cashback_Reminder_Enhanced
// @version     2020.07.04
// @author      Phreeker, dartraiden
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @match       https://www.amazon.co.uk/gp/buy/*
// @match       https://orders.ebuyer.com/customer/shopping/*
// @match       http*://pay.ebay.*
// @match       http*://cart.payments.ebay.*
// @match       http*://beru.ru/my/cart
// @match       http*://beru.ru/my/orders/payment*
// @match       http*://beru.ru/checkout
// @match       http*://lk.wildberries.ru/basket
// @match       http*://getmart.ru/personal/order/*
// @match       http*://getmart.ru/personal/cart/*
// @match       http*://www.dx.com/cart
// @match       http*://dx.com/cart
// @match       http*://www.dx.com/checkout
// @match       http*://dx.com/checkout
// @match       http*://order.gearbest.com/checkout/*
// @match       http*://cart.gearbest.com/cart/*
// @match       http*://shoppingcart.yoybuy.com/*
// @match       http*://shoppingcart.aliexpress.ru/*
// @match       http*://shoppingcart.aliexpress.com/*
// @match       http*://www.geekbuying.com/shoppingcart
// @match       http*://geekbuying.com/shoppingcart
// @match       http*://www.geekbuying.com/Checkout/*
// @match       http*://geekbuying.com/Checkout/*
// @match       http*://www.citilink.ru/order/*
// @match       http*://citilink.ru/order/*
// @match       http*://goods.ru/multicart/*
// @match       http*://www.fotosklad.ru/personal/cart/*
// @match       http*://fotosklad.ru/personal/cart/*
// @match       http*://www.fotosklad.ru/personal/order/*
// @match       http*://fotosklad.ru/personal/order/*
// @match       http*://*.jd.ru/cart/*
// @match       http*://*.jd.ru/order/*
// @match       http*://cart.jd.com/*
// @match       http*://cart.joybuy.com/*
// @match       http*://www.banggood.com/checkout*
// @match       http*://banggood.com/shopping_cart*
// @match       http*://www.banggood.com/checkout*
// @match       http*://banggood.com/shopping_cart*
// @match       http*://www.techport.ru/cart*
// @match       http*://techport.ru/cart*
// @match       http*://cart.tomtop.com/*
// @match       http*://www.oldi.ru/personal/cart/*
// @match       http*://oldi.ru/personal/cart/*
// @match       http*://*.lightinthebox.com/*shopping_cart*
// @match       http*://lightinthebox.com/*shopping_cart*
// @match       http*://*.lightinthebox.com/*checkout*
// @match       http*://lightinthebox.com/*checkout*
// @match       http*://www.miniinthebox.com/*shopping_cart*
// @match       http*://miniinthebox.com/*shopping_cart*
// @match       http*://www.miniinthebox.com/*checkout*
// @match       http*://miniinthebox.com/*checkout*
// @match       http*://www.eldorado.ru/*basket*
// @match       http*://eldorado.ru/*basket*
// @match       http*://ru-mi.com/checkout/*
// @match       http*://www.mvideo.ru/cart
// @match       http*://mvideo.ru/cart
// @match       http*://www.svyaznoy.ru/cart/*
// @match       http*://svyaznoy.ru/cart/*
// @match       http*://*.beeline.ru/shop/basket/*
// @match       http*://*.tele2.ru/shop/checkout
// @match       http*://*.shop.megafon.ru/checkout*
// @match       http*://shop.mts.ru/personal/basket
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374633/Cashback%20Reminder%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/374633/Cashback%20Reminder%20Enhanced.meta.js
// ==/UserScript==

$("body").append ( '                \
    <div id="alert">             \
        <a class ="alert href="#cashback_alert" title="Click to dismiss">Remember to check for cashback offers!</a>   \
    </div>                          \
' );

GM_addStyle ( "                                     \
    .alert {                                        \
        background-color: #a82a4c;                  \
        color: #f6f6f6 !important;                  \
        display: block;                             \
        font: 16px/40px sans-serif;                 \
        height: 40px;                               \
        position: absolute;                         \
        text-align: center;                         \
        text-decoration: none;                      \
        top: -45px;                                 \
        width: 100%;                                \
        animation: alert 1s ease forwards;          \
        -webkit-box-shadow: 0px 5px 10px -1px rgba(0,0,0,0.6);  \
        -moz-box-shadow: 0px 5px 10px -1px rgba(0,0,0,0.6);     \
        box-shadow: 0px 5px 10px -1px rgba(0,0,0,0.6);          \
        z-index: 99999;                             \
    }                                               \
    @keyframes alert {                              \
        0% { opacity: 0; }                          \
        50% { opacity: 1; }                         \
        100% { top: 0; }                            \
    }                                               \
    .alert:hover {                                  \
        color: #f6f6f6;                             \
        text-decoration:none;                       \
    }                                               \
    #alert {                                        \
         height: 25px !important;                   \
    }                                               \
" );

 $('#alert').click(function(e) {
     $('#alert').toggle();
 });
