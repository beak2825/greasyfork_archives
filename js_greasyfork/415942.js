// ==UserScript==
// @name         스파오 네이버페이
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @match        https://pay.naver.com/payments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415942/%EC%8A%A4%ED%8C%8C%EC%98%A4%20%EB%84%A4%EC%9D%B4%EB%B2%84%ED%8E%98%EC%9D%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/415942/%EC%8A%A4%ED%8C%8C%EC%98%A4%20%EB%84%A4%EC%9D%B4%EB%B2%84%ED%8E%98%EC%9D%B4.meta.js
// ==/UserScript==

$('#btn-useAllMileage').trigger('click');
$('label[for="agree_all"]').trigger('click');
setTimeout(function() {
    $('.payment.sr_only').trigger('click');
}, 150);

