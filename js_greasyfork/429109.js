// ==UserScript==
// @name         핫트주작기
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ㅎㅌ
// @author       You
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @match        http://www.hottracks.co.kr/ht/getEventRequest?eventNum=8006851749
// @icon         https://www.google.com/s2/favicons?domain=co.kr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429109/%ED%95%AB%ED%8A%B8%EC%A3%BC%EC%9E%91%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/429109/%ED%95%AB%ED%8A%B8%EC%A3%BC%EC%9E%91%EA%B8%B0.meta.js
// ==/UserScript==



var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}

var alertcnt=0;
alrtScope.alert = function (str) {
    $('body').text(++alertcnt+'회 '+str);
    $('head title').text(++alertcnt+'회 '+str);
};


function fn_event_73855_Crack(cpnId){
    $.ajax({
        type: "GET"
        ,url: "/ht/getEventRequest"
        ,data: 'eventNum=' + cpnId
        ,dataType: "json"
        ,success: function(data) {
            alert(data.msg);
        }
        ,error: function() {
            alert('시스템 오류가 발생 했습니다. 관리자에게 문의 하세요.');
        }
    });
}

var stack = 0;
var macro = setInterval(function() {
    fn_event_73855_Crack('8006851749');
    if(stack > 2000000)
        clearInterval(macro);
    stack++;
}, 1);