// ==UserScript==
// @name         1993 네이버페이 자동사리
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  오토필 확장프로그램으로 살거 미리 선택해두기 필수!
// @author       You
// @match        https://m.1993studio.com/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1993studio.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457934/1993%20%EB%84%A4%EC%9D%B4%EB%B2%84%ED%8E%98%EC%9D%B4%20%EC%9E%90%EB%8F%99%EC%82%AC%EB%A6%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457934/1993%20%EB%84%A4%EC%9D%B4%EB%B2%84%ED%8E%98%EC%9D%B4%20%EC%9E%90%EB%8F%99%EC%82%AC%EB%A6%AC.meta.js
// ==/UserScript==

var openTime = 0;   // X분에 스크립트 시작함(정각은 0)

var xmlHttp;

function srvTime(){
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open('HEAD',window.location.href.toString(),false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.send('');
        return xmlHttp.getResponseHeader("Date");
    }else if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        xmlHttp.open('HEAD',window.location.href.toString(),false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.send('');
        return xmlHttp.getResponseHeader("Date");
    }
}

function goNaverPay(){
    var pricemacro = setInterval(function() {
        if( $(".total .price").length > 0){
            clearInterval(pricemacro);
            $('.npay_btn_item a:contains("구매")').trigger('click');
        }
    }, 10);
}


function timer(){
    var startTime = new Date().getTime();
    var flag = 1;
   var macro = setInterval(function() {
       var st = srvTime();
       var now = new Date(st);
       var endTime = new Date().getTime();
       if(now.getMinutes()==openTime){
           if((endTime-startTime)>5000){
               window.location.reload();
               clearInterval(macro);
           }else{
               goNaverPay();
               clearInterval(macro);
           }
       }
   }, 10);
}



timer();
setTimeout(function() {
    $(".npay_link").html("<em>정각에 자동으로<br>구매버튼 사리하기</em>");
}, 500);