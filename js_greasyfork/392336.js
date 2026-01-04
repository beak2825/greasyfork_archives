// ==UserScript==
// @name         쿠폰핵
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.event-gs25.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392336/%EC%BF%A0%ED%8F%B0%ED%95%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/392336/%EC%BF%A0%ED%8F%B0%ED%95%B5.meta.js
// ==/UserScript==
function hack(){
    var param = {
        "uhp"   : "01097671801", //휴대폰번호
        "group" : "A-5", // A 페레로T3, B 페레로T5 C 하리보
        "uname" : "ㅇㅇㅇ" //이름
    }
    $.ajax({
        type    : "POST",
        url     : "http://www.event-gs25.com/event3_auth_1_ajax.php",
        data    : param,
        dataType: "json",
        success : function (data) {
            if (data.result_code == "0000") {
                location.replace('http://www.event-gs25.com/event3_auth_2_mag.php');
            } else if (data.result_code == "8888") { //모두소진
                alert(data.result_msg);
            } else {
                alert(data.result_msg);
            }
        }
    });
}

hack();
