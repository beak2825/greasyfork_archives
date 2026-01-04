// ==UserScript==
// @name         직장내일 어흥성어 완전 자동화
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Autofill과 함께 사용하세요!
// @author       You
// @match        https://www.jikjangevent.co.kr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389525/%EC%A7%81%EC%9E%A5%EB%82%B4%EC%9D%BC%20%EC%96%B4%ED%9D%A5%EC%84%B1%EC%96%B4%20%EC%99%84%EC%A0%84%20%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/389525/%EC%A7%81%EC%9E%A5%EB%82%B4%EC%9D%BC%20%EC%96%B4%ED%9D%A5%EC%84%B1%EC%96%B4%20%EC%99%84%EC%A0%84%20%EC%9E%90%EB%8F%99%ED%99%94.meta.js
// ==/UserScript==

window.onload = function () {
    setTimeout(function() {
        var ans = $("input[name=orgAns]").val();
        $('input[type="radio"][value='+ans+']').eq(0).trigger('click');
        $('#btnApply').eq(0).trigger('click');
    }, 30);
    setTimeout(function() {
        $('#btnSave').eq(0).trigger('click');
    }, 70);
}
