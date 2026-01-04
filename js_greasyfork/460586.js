// ==UserScript==
// @name         sr2jr Wide Screen Display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sr2jr website Wide Screen Display
// @author       fvydjt
// @match        http://www.sr2jr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sr2jr.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460586/sr2jr%20Wide%20Screen%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/460586/sr2jr%20Wide%20Screen%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css=`
        .col-md-7 {
            width: 83.33333333% !important;
        }
    `;
    GM_addStyle(css);
})();