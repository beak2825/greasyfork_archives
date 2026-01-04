// ==UserScript==
// @name         올더게이트 가상계좌
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.allthegate.com/payment/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400190/%EC%98%AC%EB%8D%94%EA%B2%8C%EC%9D%B4%ED%8A%B8%20%EA%B0%80%EC%83%81%EA%B3%84%EC%A2%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/400190/%EC%98%AC%EB%8D%94%EA%B2%8C%EC%9D%B4%ED%8A%B8%20%EA%B0%80%EC%83%81%EA%B3%84%EC%A2%8C.meta.js
// ==/UserScript==

(function() {
    $('#checkAll').trigger('click');
    $("select[name=card_select] option:eq(5)").prop("selected", true);
    $("#cash_yn").trigger('click');
    $('.next_btn').trigger('click');
})();