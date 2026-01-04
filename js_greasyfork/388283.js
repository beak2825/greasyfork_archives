// ==UserScript==
// @name         3. 위메프 결제바로클릭 & 핸드폰인증 무력화
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       You
// @match        https://mescrow.wemakeprice.com/order/*
// @match        https://order.wemakeprice.com/m/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388283/3%20%EC%9C%84%EB%A9%94%ED%94%84%20%EA%B2%B0%EC%A0%9C%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD%20%20%ED%95%B8%EB%93%9C%ED%8F%B0%EC%9D%B8%EC%A6%9D%20%EB%AC%B4%EB%A0%A5%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/388283/3%20%EC%9C%84%EB%A9%94%ED%94%84%20%EA%B2%B0%EC%A0%9C%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD%20%20%ED%95%B8%EB%93%9C%ED%8F%B0%EC%9D%B8%EC%A6%9D%20%EB%AC%B4%EB%A0%A5%ED%99%94.meta.js
// ==/UserScript==

(function() {
    $("#certicate").attr('value','true');
    $('#rd_payment_wonder').trigger('click');
    $('#personalOverseaNoChk').trigger('click'); //해외구매동의
    $("#certicate").attr('value','true');
    $("#isPointCert").attr('value',"Y");
    orderPointCommon.pointCalculationCheck();
    $("#usePointPrice").attr("disabled", "disabled");
    orderPointCommon.usePoint();
    $('#btnPaymentSubmit').trigger('click');

})();
