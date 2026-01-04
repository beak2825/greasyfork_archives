// ==UserScript==
// @name         thsrc_payment
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  高鐵購票 - 取票資訊
// @author       aKan
// @match        https://irs.thsrc.com.tw/IMINT/?wicket:interface=:*::
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404208/thsrc_payment.user.js
// @updateURL https://update.greasyfork.org/scripts/404208/thsrc_payment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isSubmitButton = $("input#isSubmit.button_main");

    if (isSubmitButton.hasOwnProperty('length') && isSubmitButton.length > 0) {
        // 身份證字號 //
        let idNumber = 'T223967552';
        // 手機號碼 //
        let mobilePhone = '0928433209';
        // 電子郵件 //
        let email = 'miileur31@gmail.com';

        $("input#idNumber.input1").val(idNumber);
        $("input#mobilePhone.input1").val(mobilePhone);
        $("input#name2622.input1").val(email);
        // 會員購票 //
        $("#memberSystemCheckBox").click();
        // 同取票人身分證字號 //
        $("#memberShipCheckBox").click();

        $("input[name='agree']").click();
    }
})();