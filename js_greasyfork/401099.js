// ==UserScript==
// @name         이엠바이 주문서 무통장 자동화 + cafe24새로고침
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        http://m.embuy.co.kr/product/detail.html?*
// @match        http://m.embuy.co.kr/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401099/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%EC%A3%BC%EB%AC%B8%EC%84%9C%20%EB%AC%B4%ED%86%B5%EC%9E%A5%20%EC%9E%90%EB%8F%99%ED%99%94%20%2B%20cafe24%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/401099/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%EC%A3%BC%EB%AC%B8%EC%84%9C%20%EB%AC%B4%ED%86%B5%EC%9E%A5%20%EC%9E%90%EB%8F%99%ED%99%94%20%2B%20cafe24%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8.meta.js
// ==/UserScript==


if(document.getElementsByClassName("mWarn").length){
    location.reload();
}

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
        if($('#authssl_loadingbar').is(':visible') && $("input:checkbox[id='chk_purchase_agreement0']").is(":checked")) {
            buy();
            console.log('보안로딩중');
        }else{
            $('#btn_payment').trigger('click');
        }
    }, 20);
}

buy();



