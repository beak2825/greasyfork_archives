// ==UserScript==
// @name         이엠바이 주문서 카드결제 자동화
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://m.embuy.co.kr/product/detail.html?*
// @match        http://m.embuy.co.kr/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400191/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%EC%A3%BC%EB%AC%B8%EC%84%9C%20%EC%B9%B4%EB%93%9C%EA%B2%B0%EC%A0%9C%20%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/400191/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%EC%A3%BC%EB%AC%B8%EC%84%9C%20%EC%B9%B4%EB%93%9C%EA%B2%B0%EC%A0%9C%20%EC%9E%90%EB%8F%99%ED%99%94.meta.js
// ==/UserScript==

function dongdi(){
    setTimeout(function() {
        if($('.total .price').text() == "0원"){
            console.log('품절');
            location.reload();
        }else if($('.total .price').text() == "0"){
            console.log('재귀');
            dongdi();
        }else{
            console.log($('.total .price').text());
            $('#actionBuy').trigger('click');
        }
    }, 20);
}

dongdi();


function buy(){
    setTimeout(function() {
        if($('#authssl_loadingbar').is(':visible')) {
            buy();
            console.log('보안로딩중');
        }else{
            $('#btn_payment').trigger('click');
        }
    }, 20);
}

buy();

