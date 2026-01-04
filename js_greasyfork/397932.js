// ==UserScript==
// @name         감자뚫기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  로그아웃시 로그인으로 이동, 네이버 판매링크, 네이버 장바구니에서 접속지연, 오류, 품절시 존나 새로고침하다가 구매가능해지면 멈추고 전체화면, 주문서에서 전체동의 누르고 나중에결제 선택후 결제누름,
// @author       You
// @match        https://smartstore.naver.com/*
// @match        https://shopping.naver.com/cart*
// @match        https://order.pay.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397932/%EA%B0%90%EC%9E%90%EB%9A%AB%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/397932/%EA%B0%90%EC%9E%90%EB%9A%AB%EA%B8%B0.meta.js
// ==/UserScript==
var mother = document.getElementsByClassName("module_detail_benefit");
var child = mother[0].getElementsByClassName("sub_text");
console.log();
//alert(child[0].innerText);
if(child[0].innerText == "고객을 위한 혜택"){
    window.location.href = 'https://nid.naver.com/nidlogin.login';
}
setTimeout(function() {

    if(document.getElementsByClassName("error_type").length == 1){
        location.reload();
    }
    if(document.getElementsByClassName("page_cart").length == 1){
        if(document.getElementById("check_all") == null){
            location.reload();
        }
    }
    if(document.getElementsByClassName("title_error").length >= 1){
        location.reload();
    }
    if(document.getElementsByClassName("not_goods").length >= 1){
        location.reload();
    }else{
        openFullScreenMode();

    }





    if(document.getElementsByClassName("order_payment").length == 1){
        var payifno = document.getElementsByClassName('_payMethodRadio');
        payifno[2].click();
        var payifnoDetail = document.getElementsByClassName('_payMeansClassRadio');
        payifnoDetail[3].click();
        document.getElementById('all_agree').click();
        nmp.front.order.order_sheet.account();
    }
}, 150);

var docV = document.documentElement;
function openFullScreenMode() {
    if (docV.requestFullscreen){
        docV.requestFullscreen();
    }else if(docV.webkitRequestFullscreen){
        docV.webkitRequestFullscreen();
    }else if (docV.mozRequestFullScreen){
        docV.mozRequestFullScreen();
    }else if (docV.msRequestFullscreen){
        docV.msRequestFullscreen();
    }
}