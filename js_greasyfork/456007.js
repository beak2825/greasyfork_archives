// ==UserScript==
// @name         PayTR_19Digit
// @version      0.0.4
// @author       karlc.
// @namespace    PayTR_19Digit_karlc
// @description  paytr解除隱藏卡號輸入欄，使用19位銀聯卡。
// @include      https://www.paytr.com/odeme/guvenli/*
// @include      https://www.paytr.com/odeme/pos.pay
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456007/PayTR_19Digit.user.js
// @updateURL https://update.greasyfork.org/scripts/456007/PayTR_19Digit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("os_cc_number").style.display = "block";
})();