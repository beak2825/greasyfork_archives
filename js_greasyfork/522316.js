// ==UserScript==
// @name         Rentry - Autofill Edit Code
// @namespace    http://tampermonkey.net/
// @version      2024-12-30
// @description  It worked like this ages ago before vía cookies. No idea why they changed that.
// @author       Guess
// @match        https://rentry.org/*/edit
// @match        https://rentry.co/*/edit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rentry.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522316/Rentry%20-%20Autofill%20Edit%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/522316/Rentry%20-%20Autofill%20Edit%20Code.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Plz specify your edit code here:
const YOUR_EDIT_CODE = "Enter ur code here";
const editCodeInput = document.getElementById("id_edit_code");
editCodeInput.value = YOUR_EDIT_CODE;
})();