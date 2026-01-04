// ==UserScript==
// @name         핫트랙스 쿠폰다운
// @namespace    http://tampermonkey.net/
// @version      2.0
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description  hot
// @author       You
// @match        http://www.hottracks.co.kr/ht/biz/eventDetail?*
// @match        http://m.hottracks.co.kr/m/biz/eventDetail?*
// @match        https://www.hottracks.co.kr/ht/biz/eventDetail?*
// @match        https://m.hottracks.co.kr/m/biz/eventDetail?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429107/%ED%95%AB%ED%8A%B8%EB%9E%99%EC%8A%A4%20%EC%BF%A0%ED%8F%B0%EB%8B%A4%EC%9A%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/429107/%ED%95%AB%ED%8A%B8%EB%9E%99%EC%8A%A4%20%EC%BF%A0%ED%8F%B0%EB%8B%A4%EC%9A%B4.meta.js
// ==/UserScript==



var stack = 0;
var macro = setInterval(function() {
    fn_event_73855('8006851749');
    if(stack > 200000)
        clearInterval(macro);
    stack++;
}, 10);

var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}

var alertcnt=0;
alrtScope.alert = function (str) {
    $('head title').text(++alertcnt+'회 '+str);
};


