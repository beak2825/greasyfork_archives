// ==UserScript==
// @name         2. PC 위메프 포인트강제사용
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://escrow.wemakeprice.com/order/*
// @match        https://order.wemakeprice.com/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411302/2%20PC%20%EC%9C%84%EB%A9%94%ED%94%84%20%ED%8F%AC%EC%9D%B8%ED%8A%B8%EA%B0%95%EC%A0%9C%EC%82%AC%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/411302/2%20PC%20%EC%9C%84%EB%A9%94%ED%94%84%20%ED%8F%AC%EC%9D%B8%ED%8A%B8%EA%B0%95%EC%A0%9C%EC%82%AC%EC%9A%A9.meta.js
// ==/UserScript==
setTimeout(function() {
    orderPointCommon.pointCalculationCheck();
    $("#usePointPrice").addClass("disabled");
    $("#usePointPrice").attr("readonly", true);
    orderPointCommon.usePoint();
    $("#btnPaymentSubmit").trigger('click');
}, 100);

