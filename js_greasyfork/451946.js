// ==UserScript==
// @name         卡单
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  为自己购买时自动卡单
// @author       liulies
// @homepage     https://greasyfork.org/zh-CN/scripts/451946
// @match        https://store.steampowered.com/cart/
// @match        https://store.steampowered.com/checkout/?purchasetype=self&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451946/%E5%8D%A1%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/451946/%E5%8D%A1%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    const delay = 4000;
    const url = new URL(window.location.href);
    console.log('开始判断页面')
    if ( url.pathname.startsWith('/cart/') ) {
        const MESSAGE = document.querySelector('.pageheader')
        MESSAGE.innerHTML += '<br>!!请关闭后再购买!!<br>!!请关闭后再购买!!'
        console.log('购物车页面，不运行')
        return;
    }else {

    setTimeout(
        () => {
        console.log('完成')
        javascript:SetTabEnabled('payment_info');
        DHighlightItem( 'payment_method', 4, true );
        const cardn = document.querySelector('#card_number');
        const expiration_month = document.querySelector('#expiration_month');
        const expiration_year = document.querySelector('#expiration_year');
        const security_code = document.querySelector('#security_code');
        cardn.value = '1145141919810893';
        expiration_month.value = '01';
        expiration_year.value = '2047'
        security_code.value = '111';
        javascript:SubmitPaymentInfoForm();
        },
        delay
    )

    console.log(delay/1000 + '秒后将开始')
    }
})();