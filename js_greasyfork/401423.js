// ==UserScript==
// @name         3. 모바일 위메프 마지막 결제수단 결제바로클릭
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        https://mescrow.wemakeprice.com/order/*
// @match        https://order.wemakeprice.com/m/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401423/3%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%9C%84%EB%A9%94%ED%94%84%20%EB%A7%88%EC%A7%80%EB%A7%89%20%EA%B2%B0%EC%A0%9C%EC%88%98%EB%8B%A8%20%EA%B2%B0%EC%A0%9C%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/401423/3%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%9C%84%EB%A9%94%ED%94%84%20%EB%A7%88%EC%A7%80%EB%A7%89%20%EA%B2%B0%EC%A0%9C%EC%88%98%EB%8B%A8%20%EA%B2%B0%EC%A0%9C%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==

//$('#rd_payment_wonder').trigger('click'); //위메프페이

$('#personalOverseaNoChk').trigger('click'); //해외구매동의

var DP = $('#sumDiscountPrice').text();

setTimeout(function() {
    orderPaymentCommon.orderCouponPop(); //쿠폰적용
}, 150);

var macro = setInterval(function() {
    if(DP != $('#sumDiscountPrice').text()){
        clearInterval(macro);
        $('#btnPaymentSubmit').trigger('click');//결제클릭
    }
}, 30);

setTimeout(function() {
    $('#btnPaymentSubmit').trigger('click');//결제클릭
}, 1500);
