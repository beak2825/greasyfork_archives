
// ==UserScript==
// @name                 YES24_TICKET
// @version              0.2.1
// @description          the script run at http://ticket.yes24.com/*
// @author               osci
// @match                http://ticket.yes24.com/Pages/English/Sale/FnPerfSaleProcess.aspx?IdPerf=*
// @match                https://stdpay.inicis.com/payMain/pay*
// @homepage             https://blog.csdn.net/kingwolf_javascript/
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/443411/YES24_TICKET.user.js
// @updateURL https://update.greasyfork.org/scripts/443411/YES24_TICKET.meta.js
// ==/UserScript==




(function () {
    'use strict';

    function check1() {
        let rdoPays2 = document.querySelector("#rdoPays2");
        let cbxUserInfoAgree1 = document.querySelector("#cbxUserInfoAgree");
        let cbxCancelFeeAgree1 = document.querySelector("#cbxCancelFeeAgree");
        let fdc_PrePayCheck1 = document.querySelector("a.dcursor[onclick='fdc_PrePayCheck();']");
        if (rdoPays2 && cbxUserInfoAgree1 && cbxCancelFeeAgree1 && fdc_PrePayCheck1) {
            rdoPays2.click();
            cbxUserInfoAgree1.click();
            cbxCancelFeeAgree1.click();
            setTimeout(() => {
                fdc_PrePayCheck1.click();
                console.log("第一步执行完毕。");
            }, 500);
        }
        else {
            setTimeout(() => {
                check1();
            }, 1000);
        }
    }
    function check2() {
        let inputAll1 = document.querySelector("#inputAll");
        let VISA1 = document.querySelector("#cardCodeEctSelect ul > li a[class='21']");
        let nextMove = document.querySelector("#CardBtn");
        if (inputAll1 && VISA1 && nextMove) {
            inputAll1.click();
            VISA1.click();
            nextMove.click();
            console.log("第二步执行完毕。");
            check3();
        }
        else {
            setTimeout(() => {
                check2();
            }, 1000);
        }
    }
    function check3() {
        let inputAll1 = document.querySelectorAll("tr>td.txtL>input");
        let cardMonth = document.querySelector('select[name="cardMonth"]');
        let cardYear = document.querySelector('select[name="cardYear"]');
        let CardGlobalBtn = document.querySelector('#CardGlobalBtn');
        let cardNumber = "1111-2222-3333-4444".split("-");
        let date = "202209"
        if (inputAll1.length == 4 && cardMonth && cardYear && CardGlobalBtn) {
            inputAll1[0].value = cardNumber[0];
            inputAll1[1].value = cardNumber[1];
            inputAll1[2].value = cardNumber[2];
            inputAll1[3].value = cardNumber[3];
            cardMonth.value = date.substr(4, 2);
            cardYear.value = date.substr(2, 2);
            CardGlobalBtn.click();
        }
        else {
            setTimeout(() => {
                check3();
            }, 1000);
        }
    }
    if (location.href.includes("http://ticket.yes24.com/Pages/English/Sale/FnPerfSaleProcess.aspx?IdPerf=")) {
        check1();
    }
    if (location.href.includes("https://stdpay.inicis.com/payMain/pay")) {
        check2();
    }

})();