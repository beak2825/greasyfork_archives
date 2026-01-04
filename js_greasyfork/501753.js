// ==UserScript==
// @name        Auto Click Button on PlusAI
// @namespace   https://github.com/mefengl
// @match       https://cc.plusai.me/app/user/*
// @grant       none
// @version     1.0
// @author      mefengl
// @description Automatically clicks the button on PlusAI every second.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/501753/Auto%20Click%20Button%20on%20PlusAI.user.js
// @updateURL https://update.greasyfork.org/scripts/501753/Auto%20Click%20Button%20on%20PlusAI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndClickButton() {
        const button = document.querySelector('#pywebio-scope-subs_detail_table button');
        if (button) {
            button.click();
        }
    }

    setInterval(checkAndClickButton, 1000);
})();
