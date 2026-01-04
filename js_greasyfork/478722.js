// ==UserScript==
// @name         新增折讓單
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  新增折讓單 功能
// @author       You
// @match        https://invoice.amego.tw/vendor/88469296/invoice_d0401_add?acmid=*
// @match        https://invoice.amego.tw/vendor/88469296/invoice_d0401_add_combine?acmid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amego.tw*Ｓ
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478722/%E6%96%B0%E5%A2%9E%E6%8A%98%E8%AE%93%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/478722/%E6%96%B0%E5%A2%9E%E6%8A%98%E8%AE%93%E5%96%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('input[name="buyer_email_address"]').val('ethan.li.dy@gmail.com');
    $('input[name="allowance_number"]').val($('label:contains("原發票號碼")').next().text()+"_001");

    // Your code here...
})();