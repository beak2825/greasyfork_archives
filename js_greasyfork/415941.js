// ==UserScript==
// @name         스파오 결제
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*.spao.com/order/orderform.html?*
// @match        https://*.spao.com/order/orderform.html?*
// @match        http://*.spao.co.kr/order/orderform.html?*
// @match        https://*.spao.co.kr/order/orderform.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415941/%EC%8A%A4%ED%8C%8C%EC%98%A4%20%EA%B2%B0%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/415941/%EC%8A%A4%ED%8C%8C%EC%98%A4%20%EA%B2%B0%EC%A0%9C.meta.js
// ==/UserScript==

(function() {
    $('#oemail2').val("naver.com");// 이메일뒷자리
    $('#ophone2_2').val("1111");// 전번중간
    $('#ophone2_3').val("2222"); //전번뒷자리
    $('label[for="allAgree"]').trigger('click');
    var pay1 = setInterval(function() {
        if($("#authssl_loadingbar").css("display") == "none"){
            $('#btn_payment').trigger('click');
            clearInterval(pay1);
        }
    }, 100);

    var macro = setInterval(function() {
        if($("#ec-shop_orderConfirmLayer").css("display") != "none"){
            $("#ec-shop_btn_layer_payment").trigger('click');
            clearInterval(macro);
        }
    }, 100);

})();


