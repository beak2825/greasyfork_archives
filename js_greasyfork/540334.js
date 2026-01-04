// ==UserScript==
// @name         Auto-fill alldatasheet code
// @namespace    https://eastarcti.ca
// @version      2025-06-21
// @description  Automatically fills the alldatasheet download security code.
// @author       East_Arctica
// @match        https://www.alldatasheet.com/datasheet-pdf/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alldatasheet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540334/Auto-fill%20alldatasheet%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/540334/Auto-fill%20alldatasheet%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const form = document.querySelector('form[name="frmDn"]');
    const codeRow = [...form.querySelectorAll('tr')].find(node => node.innerText.includes('Security code :'))
    const code = [...codeRow.querySelectorAll('td')].slice(1).map(node => node.innerText).join('')
    const codeInput = form.querySelector('input[name="innum"]')
    codeInput.value = code;
})();