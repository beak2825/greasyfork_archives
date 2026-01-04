// ==UserScript==
// @name         EmsAutoFill
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  中華郵政EMS進度查詢自動從網址帶入單號
// @author       AndrewWang
// @include      https://postserv.post.gov.tw/pstmail/main_mail.html*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530685/EmsAutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/530685/EmsAutoFill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const input = document.getElementById('MAILNO');
        if (input) {
            const params = new URLSearchParams(window.location.search);
            let targetTxn = params.get('targetTxn');
            let sn = params.get('sn');

            if (targetTxn == 'EB500200' && sn != undefined) {
                input.focus();
                input.value = sn;
                input.dispatchEvent(new Event('input', { bubbles: true }));

                document.getElementById('captcha').focus();
            }
        }
    }, 700);
})();