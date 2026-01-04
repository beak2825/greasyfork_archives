// ==UserScript==
// @name         Modify IQ-WEB User-EDIT Select Height
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set the height of the select box to 1000px
// @author       Aliev P.A.
// @match        *://*/pacs/modifyUser.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473389/Modify%20IQ-WEB%20User-EDIT%20Select%20Height.user.js
// @updateURL https://update.greasyfork.org/scripts/473389/Modify%20IQ-WEB%20User-EDIT%20Select%20Height.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var selectElement = document.querySelector('select[name="sourceae[]"]');
        if (selectElement) {
            selectElement.style.height = '1000px';
        }
    });

})();
