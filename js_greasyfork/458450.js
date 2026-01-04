// ==UserScript==
// @name         Show BalanceUsageMode input
// @namespace    cc QA
// @version      0.4
// @description  unhide and set border to BalanceUsageMode input
// @author       You
// @match        */form/step-1/*
// @match        */form/step-1
// @match        */form/step-2/*
// @match        */form/step-3/*


// @icon         https://www.google.com/s2/favicons?sz=64&domain=custom-writing.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458450/Show%20BalanceUsageMode%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/458450/Show%20BalanceUsageMode%20input.meta.js
// ==/UserScript==

(function() {
    'use strict';
const input = document.querySelector('input[name="balance_usage_mode"]');
    if(!input) {
        return;
    }
    input.removeAttribute('type');
    input.style.border = '1px solid red';
    console.log(input);
})();