// ==UserScript==
// @name         0. 위메프 동디션 쿠폰적용
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mescrow.wemakeprice.com/coupon/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401466/0%20%EC%9C%84%EB%A9%94%ED%94%84%20%EB%8F%99%EB%94%94%EC%85%98%20%EC%BF%A0%ED%8F%B0%EC%A0%81%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/401466/0%20%EC%9C%84%EB%A9%94%ED%94%84%20%EB%8F%99%EB%94%94%EC%85%98%20%EC%BF%A0%ED%8F%B0%EC%A0%81%EC%9A%A9.meta.js
// ==/UserScript==


var radionum = $('.radio_mid').length

$('.radio_mid').eq(radionum-2).trigger('click');

coupon.applyCoupon();