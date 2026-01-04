// ==UserScript==
// @name         인증자동화
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.mobile-ok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393159/%EC%9D%B8%EC%A6%9D%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/393159/%EC%9D%B8%EC%A6%9D%EC%9E%90%EB%8F%99%ED%99%94.meta.js
// ==/UserScript==


setTimeout(function() {
    $('#agency-and').trigger('click');
    $('#allchk').trigger('click');
    $('.btn_type3 ').trigger('click');
    //#agency-and은 알뜰 일반통신사 쓰는사람은 몰라시벌

    //$('#telco01').trigger('click');
    //$('#telco02').trigger('click');
    $('#telco03').trigger('click');

    //tele01은 SK알뜰, 02는 KT알뜰 03은 유쁠알뜰
    //안쓰는건 앞에 슬래시두개 (//)로 비활성화하셈 알뜰안쓰면 세개다 비활성화

    $('.tab_app').trigger('click');

}, 50);

setTimeout(function() {
    mSubmit();
}, 100);
setTimeout(function() {
    $('#app_form .btn_grey').trigger('click');
}, 200);