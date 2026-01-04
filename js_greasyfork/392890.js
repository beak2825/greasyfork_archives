// ==UserScript==
// @name         텐바이텐 매크로 (오토필필수)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  사리나무는 악용금지
// @author       You
// @match        https://www.10x10.co.kr/*
// @match        http://www.10x10.co.kr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392890/%ED%85%90%EB%B0%94%EC%9D%B4%ED%85%90%20%EB%A7%A4%ED%81%AC%EB%A1%9C%20%28%EC%98%A4%ED%86%A0%ED%95%84%ED%95%84%EC%88%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392890/%ED%85%90%EB%B0%94%EC%9D%B4%ED%85%90%20%EB%A7%A4%ED%81%AC%EB%A1%9C%20%28%EC%98%A4%ED%86%A0%ED%95%84%ED%95%84%EC%88%98%29.meta.js
// ==/UserScript==

(function() {
    $('.btnDrop:first').trigger('click');
    setTimeout(function() {
        $('.dropBox.on:first a:first').trigger('click');
    }, 20);
    setTimeout(function() {
        $('.btnDrop').eq(1).trigger('click');
    }, 40);
    setTimeout(function() {
        $('.dropBox.on:first a:first').trigger('click');
    }, 60);

    setTimeout(function() {
        $('.btn.btnB1.btnRed').trigger('click');
    }, 80);
    setTimeout(function() {
        $('#btnPay').trigger('click');
    }, 80);
    setTimeout(function() {
        $('.time-items-on.time-items a').eq(0).trigger('click');
    }, 80);

})();