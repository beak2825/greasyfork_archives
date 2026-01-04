// ==UserScript==
// @name         PTer Admin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes all hidden inputs from the page
// @match        https://pterclub.com/userdetails.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463884/PTer%20Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/463884/PTer%20Admin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the form element with method="post" and action="modtask.php"
    var formElement = document.querySelector('form[method="post"][action="modtask.php"]');

    // Find all input elements within the form with type="hidden"
    var hiddenInputs = formElement.querySelectorAll('input[type="hidden"]');

    // Loop through each hidden input element and remove the type="hidden" attribute
    hiddenInputs.forEach(function(hiddenInput) {
        hiddenInput.removeAttribute('type');
    });
})();