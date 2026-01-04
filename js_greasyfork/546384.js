// ==UserScript==
// @name    Advance_Search
// @version  1.3
// @grant    none
// @description advance search with one Enter !
// @license MIT
// @match     https://clients.netafraz.com/admin/addonmodules.php*
// @namespace https://greasyfork.org/users/1419751
// @downloadURL https://update.greasyfork.org/scripts/546384/Advance_Search.user.js
// @updateURL https://update.greasyfork.org/scripts/546384/Advance_Search.meta.js
// ==/UserScript==
// Programmed and developed by Farshad Mehryar (@farshad271)

(function () {
    'use strict';

    function runScript() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("module") === "advancesearch") {
            const hiddenButton = document.querySelector('.hidden-md');
            if (hiddenButton) hiddenButton.click();

            const phoneInput = document.querySelector('div.form-group:nth-child(23) > input:nth-child(2)');
            if (phoneInput) {
                phoneInput.focus();
                document.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        const searchButton = document.querySelector('button.btn:nth-child(8)');
                        if (searchButton) searchButton.click();
                    }
                });
            }
        }
    }
    if (document.readyState === "complete") {
        runScript();
    } else {
        document.addEventListener("readystatechange", function () {
            if (document.readyState === "complete") {
                runScript();
            }
        });
    }
})();