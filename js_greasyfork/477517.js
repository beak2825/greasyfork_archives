// ==UserScript==
// @name         Auto Click Button
// @namespace    http://tampermonkey.net/
// @version      0.87
// @description  Auto click all buttons with type "button", value "收錄至個人題庫", and classes "btn", "btn-default", "myQuestion", "pull-right"
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477517/Auto%20Click%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/477517/Auto%20Click%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
    // Wait for the document to be fully loaded
    window.addEventListener('load', function() {
        // Get all input elements of type 'button' with the specific value and classes
        var buttons = document.querySelectorAll('input[type="button"][value="收錄至個人題庫"].btn.btn-default.myQuestion.pull-right');
 
        // Loop through the buttons
        for (var i = 0; i < buttons.length; i++) {
            // Click the button
            buttons[i].click();
        }
    });
})();
