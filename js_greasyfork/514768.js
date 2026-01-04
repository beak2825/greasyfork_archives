// ==UserScript==
// @name         U2 Magic Form
// @namespace    https://u2.dmhy.org/
// @version      1.0
// @description  Automatically set minimum-cost values in the magic form.
// @author       LightArrowsEXE
// @grant        GM_xmlhttpRequest
// @match        *://u2.dmhy.org/*
// @exclude      *://u2.dmhy.org/shoutbox.php*
// @icon         https://u2.dmhy.org/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514768/U2%20Magic%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/514768/U2%20Magic%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hoursInput = document.querySelector('input[name="hours"]');

    if (hoursInput) {
        hoursInput.value = "24";
    }

    const radioLabel = document.querySelector('label[for="s_user_self"]');

    if (radioLabel) {
        const radioInput = document.getElementById(radioLabel.getAttribute("for"));

        if (radioInput) {
            radioInput.checked = true;
        }
    }

    const queryButton = document.querySelector("input#btn_query");

    if (queryButton) {
        queryButton.click();
    }
})();
