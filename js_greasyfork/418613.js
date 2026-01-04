// ==UserScript==
// @name         Hiding Yahoo Alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description Hiding modal-outer
// @author       Xiao Yi
// @match        https://mail.yahoo.com/d/folders/1?.src=fp&.intl=tw&.lang=zh-Hant-TW
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418613/Hiding%20Yahoo%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/418613/Hiding%20Yahoo%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function () {
        var bitch = document.querySelectorAll('[aria-labelledby="adblock-delay-dismiss-cue"]');
        bitch[0].style.display = "none";
        console.log('Bye bye bitch');
    })

})();