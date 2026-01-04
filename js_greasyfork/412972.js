// ==UserScript==
// @name         BankID filler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fill BankID forms automagically
// @author       You
// @match        https://demo.bankid.com/*
// @require      https://cdn.jsdelivr.net/npm/swedish-ssn-tool@1.0/dist/swedish-ssn.min.js
// @require      https://cdn.jsdelivr.net/npm/luxon@1.25/build/global/luxon.min.js
// @require      https://cdn.jsdelivr.net/npm/faker@5.1/dist/faker.min.js
// @require      https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @resource     NOTYF_CSS https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/412972/BankID%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/412972/BankID%20filler.meta.js
// ==/UserScript==

const PERSONAL_CODE = 'M62pgAyO';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomSSN() {
    const randomDate = luxon.DateTime.local(1970, 1, 1).plus({ days: getRandomInt(0, 365 * 20) }).toJSDate();
    const ssn = SwedishSSN.generateSSNWithParameters(randomDate);
    return `19${ssn.replace('-', '')}`;
}

(function() {
    'use strict';

    const notyfCSS = GM_getResourceText("NOTYF_CSS");
    GM_addStyle(notyfCSS);

    const notyf = new Notyf({
       position: { x: 'right', y: 'top' }
    });
    faker.locale = 'sv';

    $(document).ready(function () {
        $('input[name="ctl00$MainContent$txtCode"]').val(PERSONAL_CODE);

        const ssn = getRandomSSN();
        const ssnField = $('input[name="ctl00$MainContent$txtPnrHamta"]');

        $('<a class="BlueButton glossy" style="width: 100px; display: inline; margin-left: 10px; font-size: 1.25rem">⎘</a>')
            .click(() => {
                navigator.clipboard.writeText(ssn)
                notyf.success('SSN copied to clipboard')
            })
            .insertAfter(ssnField);

        if (!ssnField.val()) {
            ssnField.val(ssn);
            $('input[name="ctl00$MainContent$txtFirstName"]').val(faker.name.firstName());
            $('input[name="ctl00$MainContent$txtLastName"]').val(faker.name.lastName());
        }
    });
})();