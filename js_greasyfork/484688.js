// ==UserScript==
// @name            Litres.ru Code1 AutoFill
// @name:ru         Litres.ru Автоприменение промокодов
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     AutoFill the 'code1' field on litres.ru if not already filled
// @description:ru  Автозаполнение поля 'code1' на сайте litres.ru, если оно еще не заполнено
// @author          You
// @match           https://www.litres.ru/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/484688/Litresru%20Code1%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/484688/Litresru%20Code1%20AutoFill.meta.js
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
    var code1Field = document.getElementsByName('code1')[0];
    if (code1Field && !code1Field.value.trim()) {
        // Get the 'code1' parameter from the URL
        var code1Param = getParameterByName('code1');

        // If 'code1' parameter exists, fill the field and click the button
        if (code1Param) {
            code1Field.value = code1Param;

            // Click the activation button
            var activateButton = document.getElementById('activate_coupon');
            if (activateButton) {
                activateButton.click();
            }
        }
    }
})();
