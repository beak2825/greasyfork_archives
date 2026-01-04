// ==UserScript==
// @name            Litres.ru Code1 AutoFill
// @name:ru         Litres.ru Автоприменение промокодов
// @namespace       http://tampermonkey.net/
// @version         0.4
// @description     AutoFill the 'code1' field on litres.ru if not already filled
// @description:ru  Автозаполнение поля 'code1' на сайте litres.ru, если оно еще не заполнено
// @author          You
// @match           https://www.litres.ru/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/518346/Litresru%20Code1%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/518346/Litresru%20Code1%20AutoFill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get URL parameter by name
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Check if the 'code1' field is not filled
    var code1Field = document.getElementsByName('promocode')[0];
    if (code1Field && !code1Field.value.trim()) {
        // Get the 'code1' parameter from the URL
        var code1Param = getParameterByName('code1');

        // If 'code1' parameter exists, fill the field and simulate typing
        if (code1Param) {
            code1Field.focus(); // Focus on the input field
            code1Field.value = code1Param; // Set the value
            code1Field.dispatchEvent(new Event('input', { bubbles: true })); // Trigger an input event

            // Simulate typing by adding and removing a space
            code1Field.value += ' ';
            code1Field.dispatchEvent(new Event('input', { bubbles: true }));
            code1Field.value = code1Param;
            code1Field.dispatchEvent(new Event('input', { bubbles: true }));

            // Find the form and submit it
            var form = code1Field.closest('form');
            if (form) {
                var submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.click(); // Click the submit button
                } else {
                    form.submit(); // Fallback to submitting the form directly
                }
            }
        }
    }
})();
