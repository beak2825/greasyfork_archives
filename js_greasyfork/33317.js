// ==UserScript==
// @name         Removes paywall from Spiegel.de
// @version      0.1
// @description  Removes Paywall
// @match        http://www.spiegel.de/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @namespace https://greasyfork.org/users/153188
// @downloadURL https://update.greasyfork.org/scripts/33317/Removes%20paywall%20from%20Spiegelde.user.js
// @updateURL https://update.greasyfork.org/scripts/33317/Removes%20paywall%20from%20Spiegelde.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Unblock plus articles
    var obfuscatedContent = document.getElementsByClassName('obfuscated-content');
    if (obfuscatedContent.length > 0) {
        SPLaterpay.callback.hasAccess();
        $('.lp_mwi_payment-method-wrapper').parent().parent().hide();
        $('.deobfuscated-content').parent().removeClass();
    }

})();