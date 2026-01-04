// ==UserScript==
// @name         인터파크 인생날 도우미
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://inday.interpark.com/event/inday/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392540/%EC%9D%B8%ED%84%B0%ED%8C%8C%ED%81%AC%20%EC%9D%B8%EC%83%9D%EB%82%A0%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/392540/%EC%9D%B8%ED%84%B0%ED%8C%8C%ED%81%AC%20%EC%9D%B8%EC%83%9D%EB%82%A0%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==

var dd =  $('.productNo dd'); //상품코드 찾는 함수
copy("http://inpk.kr/s/"+ dd.html()) // 클립보드 복사 함수호출
window.open( "http://m.shop.interpark.com/product/"+dd.html() +"/0000100000",  '_blank' ); //새창으로 여는 함수

function copy(val) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = val;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}