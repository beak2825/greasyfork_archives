// ==UserScript==
// @name         이엠바이 주문서 가상계좌 자동화
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://m.embuy.co.kr/product/detail.html?*
// @match        http://m.embuy.co.kr/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400188/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%EC%A3%BC%EB%AC%B8%EC%84%9C%20%EA%B0%80%EC%83%81%EA%B3%84%EC%A2%8C%20%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/400188/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%EC%A3%BC%EB%AC%B8%EC%84%9C%20%EA%B0%80%EC%83%81%EA%B3%84%EC%A2%8C%20%EC%9E%90%EB%8F%99%ED%99%94.meta.js
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
            $("img[pay_code='icash']").parent().trigger('click');
            $('#btn_payment').trigger('click');
        }
    }, 20);
}

buy();

