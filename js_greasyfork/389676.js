// ==UserScript==
// @name         3. 위메프 고무통 결제바로클릭
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://escrow.wemakeprice.com/order/*
// @match        https://order.wemakeprice.com/order/*
// @match        https://mescrow.wemakeprice.com/order/*
// @match        https://order.wemakeprice.com/m/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389676/3%20%EC%9C%84%EB%A9%94%ED%94%84%20%EA%B3%A0%EB%AC%B4%ED%86%B5%20%EA%B2%B0%EC%A0%9C%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/389676/3%20%EC%9C%84%EB%A9%94%ED%94%84%20%EA%B3%A0%EB%AC%B4%ED%86%B5%20%EA%B2%B0%EC%A0%9C%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==

(function() {
   // $('#rd_payment_wonder').trigger('click');
   // $('#payment_method_6').trigger('click');
   //  $('#paymentTab em').eq(0).trigger('click');//eq 0번 신용카드 선택, 5번 간편결제
   //   $('#cardSelect li').eq(1).trigger('click');//eq 0번 신한카드
    $('#orderConditions').trigger('click'); //주문동의
    $('#personalOverseaNoChk').trigger('click'); //해외구매동의



    setTimeout(function() {
        $('#btnPaymentSubmit').trigger('click');//pc주문
         $('.bx_type1.orderer-agree-list label:first').trigger('click');
         $('#policy_agree_all').trigger('click');
         $('input[type="submit"][value="결제하기"]').trigger('click');
    }, 200);
    setTimeout(function() {
           $('#pay_submit_btn').trigger('click');
           $('.btns_sys.red_big_xxl.settlement:first').trigger('click');
    }, 300);


})();