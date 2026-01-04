// ==UserScript==
// @name         Uncheck 'trust this device' for Google login - 2019 edition
// @namespace    de.yaf3li.tampermonkey.google.twofa
// @version      0.2
// @description  This script attempts to uncheck the 'trust this device' option that is enabled by default when signing into a Google account with 2FA enabled. Thanks to Gonçalo for the 2019 update.
// @author       YaF3li
// @match        *://accounts.google.com/*
// @noframes
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39866/Uncheck%20%27trust%20this%20device%27%20for%20Google%20login%20-%202019%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/39866/Uncheck%20%27trust%20this%20device%27%20for%20Google%20login%20-%202019%20edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Note that this timeout approach is not very nice, but it works as far as I can tell

    function tryUncheck() {
        var chkbox = document.querySelector('[aria-labelledby="toggle-c0"]');
        if(chkbox != null) {
            //chkbox.setAttribute('aria-checked', 'false');
            if(chkbox.getAttribute('aria-checked')) {
                chkbox.click();
            }
        } else {
            window.setTimeout(tryUncheck, 250);
        }
    }

    tryUncheck();

})();