// ==UserScript==
// @name         야쿠르트 주작기
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://game.hyfreshevent.co.kr/same/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410662/%EC%95%BC%EC%BF%A0%EB%A5%B4%ED%8A%B8%20%EC%A3%BC%EC%9E%91%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/410662/%EC%95%BC%EC%BF%A0%EB%A5%B4%ED%8A%B8%20%EC%A3%BC%EC%9E%91%EA%B8%B0.meta.js
// ==/UserScript==
var crackScore= 0;// 원하는 점수 입력하세요

(function() {

    setTimeout(function() {
        alert(crackScore+"점으로 주작할 에정입니다 랭킹을 다시한번 확인하세요.");
        var macro = setInterval(function() {
            if($("input[type='number']").length != 1){
                setTimeout(function() {
                    crack(crackScore);
                }, 10000);
                clearInterval(macro);
            }
        }, 100);
    }, 1000);

})();

function crack(crackScore){
    var a = {
        name: USER_NAME,
        phone: USER_NUMBER,
        score: crackScore,
        key: USER_KEY
    };
    cc.log(a);
    a = ycrypt(a);
    cc.log(a);
    $.ajax({
        async: !0,
        crossDomain: !0,
        url: API + "result",
        method: "POST",
        timeout: 1E4,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "*/*",
            "cache-control": "no-cache"
        },
        data: {
            enc: a
        }
    }).done(function(a) {
        cc.log(a);
        a.hasOwnProperty("result") && (!0 != a.result && (a.hasOwnProperty("err") ? viewTextAlert("result error :: " + a.err) : viewTextAlert("result error.")), cc.director.getRunningScene().fnViewGameOver())
    }).error(function(a) {
        cc.director.getRunningScene().fnSendResultError(a)
    })
    setTimeout(function() {
        alertcrack(crackScore);
    }, 300);
};

function alertcrack(crackScore){
    alert(crackScore+"점으로 주작완료");
};


