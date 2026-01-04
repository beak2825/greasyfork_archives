// ==UserScript==
// @name         myPOS Timer Bypass
// @namespace    https://gitlab.com/user890104
// @version      2025-08-07
// @author       Vencislav Atanasov
// @description  Prevents myPOS from redirecting you out of their dashboard
// @match        https://merchant.mypos.com/*/account
// @connect      self
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mypos.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544922/myPOS%20Timer%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/544922/myPOS%20Timer%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.addEventListener('beforeunload', e => e.preventDefault());

    setInterval(function() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://merchant.mypos.com/bg/account/api/accounts/transactions',
        });
    }, 30 * 1000);
})();