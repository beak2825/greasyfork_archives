// ==UserScript==
// @name         Raucous .07
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  rawrcous
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369230/Raucous%2007.user.js
// @updateURL https://update.greasyfork.org/scripts/369230/Raucous%2007.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($("li:contains('Please review the website for evidence that ')").length) {
        console.log("Raucous .07");
        $("input[name=external_feedback][value=NO]").click();
        document.onkeydown = function (k) {
           if (k.keyCode >= 96 && k.keyCode <= 105) {
               $("select[name=captcha_challenge_response]").val(String(k.keyCode - 96));
           }
           else if (k.keyCode >= 48 && k.keyCode <= 57) {
               $("select[name=captcha_challenge_response]").val(String(k.keyCode - 48));
           }
       };
    }
})();