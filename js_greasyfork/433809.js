// ==UserScript==
// @name         네이버페이 모바일 주문서
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  나중에 결제 자동화
// @author       You
// @match        https://m.pay.naver.com/o/orderSheet/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433809/%EB%84%A4%EC%9D%B4%EB%B2%84%ED%8E%98%EC%9D%B4%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%A3%BC%EB%AC%B8%EC%84%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/433809/%EB%84%A4%EC%9D%B4%EB%B2%84%ED%8E%98%EC%9D%B4%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%A3%BC%EB%AC%B8%EC%84%9C.meta.js
// ==/UserScript==


var macro = setInterval(function() {
    if( $('label:contains("일반결제")').length > 0){
        clearInterval(macro);
        $('label:contains("일반결제")').trigger('click');
        $('._layer_no_payment button:contains("확인")').trigger('click');
        $('strong:contains("나중에 결제")').trigger('click');
        $('span:contains("주문하기")').trigger('click');
    }
}, 10);

