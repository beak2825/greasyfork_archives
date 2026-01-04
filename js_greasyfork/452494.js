// ==UserScript==
// @name         Reload page運輸署error頁面重新連接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  遇到幾個error畫面會自動重新載入系統
// @author       You
// @match        https://eapps2.td.gov.hk/repoes/td-es-app517/InvalidToken.do*
// @match        https://eapps1.td.gov.hk/repoes/td-es-app517/InvalidToken.do*
// @match        https://eapps.td.gov.hk/repoes/td-es-app517/InvalidToken.do*
// @match        https://eapps2.td.gov.hk/repoes/td-es-app517/Timeout.do*
// @match        https://eapps1.td.gov.hk/repoes/td-es-app517/Timeout.do*
// @match        https://eapps.td.gov.hk/repoes/td-es-app517/Timeout.do*
// @match        https://eapps2.td.gov.hk/?queueittoken=e_retasprod~q_*
// @match        https://eapps1.td.gov.hk/?queueittoken=e_retasprod~q_*
// @match        https://eapps.td.gov.hk/?queueittoken=e_retasprod~q_*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452494/Reload%20page%E9%81%8B%E8%BC%B8%E7%BD%B2error%E9%A0%81%E9%9D%A2%E9%87%8D%E6%96%B0%E9%80%A3%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/452494/Reload%20page%E9%81%8B%E8%BC%B8%E7%BD%B2error%E9%A0%81%E9%9D%A2%E9%87%8D%E6%96%B0%E9%80%A3%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var des_url = "https://eapps-queue.td.gov.hk/?c=transportdep&e=retasprod&t=https%3A%2F%2Feapps.td.gov.hk%2Frepoes%2Fapp517_tc.html&cid=en-US";

    document.location = des_url;

})();