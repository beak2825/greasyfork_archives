// ==UserScript==
// @name         BKN: Click NIK Verifikasi-SSCASN
// @namespace    https://verifikasi-sscasn.bkn.go.id/cpns/verifikasi
// @version      0.1
// @license      MIT
// @description  Click field NIK
// @author       chm
// @match        https://verifikasi-sscasn.bkn.go.id/cpns/verifikasi
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476933/BKN%3A%20Click%20NIK%20Verifikasi-SSCASN.user.js
// @updateURL https://update.greasyfork.org/scripts/476933/BKN%3A%20Click%20NIK%20Verifikasi-SSCASN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const clickNik = async () => {
        await delay(500);
        document.querySelector("#mat-chip-list-input-0").click();

        await delay(500);
        document.querySelector("#mat-input-0").click();
    };

    clickNik()
})();