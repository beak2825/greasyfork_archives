// ==UserScript==
// @name         MicrosoftDefaultUser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://login.microsoftonline.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422003/MicrosoftDefaultUser.user.js
// @updateURL https://update.greasyfork.org/scripts/422003/MicrosoftDefaultUser.meta.js
// ==/UserScript==

function clickUser() {
    jQuery("#tilesHolder .table-row").first().click()
}

function clickSignIn() {
    jQuery(':input[value="Sign in"]').click()
}

(function() {
    'use strict';
    setTimeout(clickUser, 1000);
    setTimeout(clickUser, 1500);
    setTimeout(clickSignIn, 2000);
    setTimeout(clickSignIn, 2500);
    setTimeout(clickSignIn, 4500);
    // Your code here...
})();