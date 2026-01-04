// ==UserScript==
// @name         쿠팡이츠 tampermonkey용
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Runs a function at 59 minutes and 55 seconds
// @match        https://eats-mobile-web.coupang.com/promotion/landing-page-v3/?key=WOW_FLASH*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499898/%EC%BF%A0%ED%8C%A1%EC%9D%B4%EC%B8%A0%20tampermonkey%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/499898/%EC%BF%A0%ED%8C%A1%EC%9D%B4%EC%B8%A0%20tampermonkey%EC%9A%A9.meta.js
// ==/UserScript==



var openTime = 0;   // X분에 스크립트 시작함(정각은 0)

var xmlHttp;

function srvTime(){
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open('HEAD',"https://eats-mobile-web.coupang.com/promotion/landing-page-v3/404",false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.send('');
        return xmlHttp.getResponseHeader("Date");
    }else if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        xmlHttp.open('HEAD',"https://eats-mobile-web.coupang.com/promotion/landing-page-v3/404",false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.send('');
        return xmlHttp.getResponseHeader("Date");
    }
}

function timer(){
    var macro = setInterval(function() {
        var st = srvTime();
        var now = new Date(st);
        if(now.getMinutes()==openTime){
            const btnCoupon = document.querySelector('.Button_button-container__aHYl0');
            btnCoupon.click();
            clearInterval(macro);

        }
    }, 10);
}

let intervalId;

function run() {
    timer();
}

function checkTime() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (minutes === 59 && seconds >= 55) {
        run();
        clearInterval(intervalId);
    }
}

intervalId = setInterval(checkTime, 300);