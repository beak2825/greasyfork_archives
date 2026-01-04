// ==UserScript==
// @name         Auto Fill CEAC NIV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填充 CEAC NIV 表单并选择特定选项
// @author       Bluefissure
// @license      MIT
// @match        https://ceac.state.gov/CEACStatTracker/Status.aspx?App=NIV*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496605/Auto%20Fill%20CEAC%20NIV.user.js
// @updateURL https://update.greasyfork.org/scripts/496605/Auto%20Fill%20CEAC%20NIV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const locationDropdown = document.getElementById('Location_Dropdown');
        if (locationDropdown) {
            locationDropdown.value = 'GUZ';
        }

        const visaCaseNumberInput = document.getElementById('Visa_Case_Number');
        if (visaCaseNumberInput) {
            visaCaseNumberInput.value = '123456';
        }

        const passportNumberInput = document.getElementById('Passport_Number');
        if (passportNumberInput) {
            passportNumberInput.value = 'E98765432';
        }

        const surnameInput = document.getElementById('Surname');
        if (surnameInput) {
            surnameInput.value = 'ABCDE';
        }
    });
})();