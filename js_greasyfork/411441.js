// ==UserScript==
// @name         1. PC 위메프 첫항목 클릭과 구매
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://front.wemakeprice.com/deal/*
// @match        http://www.wemakeprice.com/deal/adeal/*
// @match        https://front.wemakeprice.com/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411441/1%20PC%20%EC%9C%84%EB%A9%94%ED%94%84%20%EC%B2%AB%ED%95%AD%EB%AA%A9%20%ED%81%B4%EB%A6%AD%EA%B3%BC%20%EA%B5%AC%EB%A7%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/411441/1%20PC%20%EC%9C%84%EB%A9%94%ED%94%84%20%EC%B2%AB%ED%95%AD%EB%AA%A9%20%ED%81%B4%EB%A6%AD%EA%B3%BC%20%EA%B5%AC%EB%A7%A4.meta.js
// ==/UserScript==

setTimeout(function() {
    $('.item_option li').first().trigger('click');
    setTimeout(function() {
        $('.red_big_xb').first().trigger('click');
    }, 300);
}, 100);
