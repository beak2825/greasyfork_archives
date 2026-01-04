// ==UserScript==
// @name         넵무새 완전 자동화
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Autofill과 함께 사용하세요!
// @author       You
// @match        https://www.jikjangevent.co.kr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389273/%EB%84%B5%EB%AC%B4%EC%83%88%20%EC%99%84%EC%A0%84%20%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/389273/%EB%84%B5%EB%AC%B4%EC%83%88%20%EC%99%84%EC%A0%84%20%EC%9E%90%EB%8F%99%ED%99%94.meta.js
// ==/UserScript==

(function() {
        setTimeout(function() {
             $('input[type="radio"][value='+ans+']').eq(0).trigger('click');
             $('#btnApply').eq(0).trigger('click');
        }, 30);
        setTimeout(function() {
             $('#btnSave').eq(0).trigger('click');
        }, 70);
})();