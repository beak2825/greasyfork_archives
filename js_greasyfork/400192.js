// ==UserScript==
// @name         올더게이트 카드결제
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.allthegate.com/payment/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400192/%EC%98%AC%EB%8D%94%EA%B2%8C%EC%9D%B4%ED%8A%B8%20%EC%B9%B4%EB%93%9C%EA%B2%B0%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/400192/%EC%98%AC%EB%8D%94%EA%B2%8C%EC%9D%B4%ED%8A%B8%20%EC%B9%B4%EB%93%9C%EA%B2%B0%EC%A0%9C.meta.js
// ==/UserScript==

(function() {
    $('#checkAll').trigger('click');
    $('div[onclick*="비씨"]').trigger('click');//수정
    $('#chk_agree').trigger('click');
    $('.next_btn').trigger('click');
})();