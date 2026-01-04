// ==UserScript==
// @name         Auth Fit username fix
// @namespace    http://tampermonkey.net/
// @version      2025-06-06
// @description  Removes the unwanted email part of the username
// @author       You
// @match        https://auth.fit.cvut.cz/login.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cvut.cz
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538562/Auth%20Fit%20username%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/538562/Auth%20Fit%20username%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var textField = document.querySelector('input[name="j_username"]');
    if (textField) {
        textField.addEventListener('input', function() {
            var currentValue = textField.value;
            if(currentValue){
                var username = currentValue.split('@')[0];
                textField.value = username;
            }
        });
    }
    // Your code here...
})();