
// ==UserScript==
// @name         REmove_badbad
// @namespace    WoIveRinE
// @version      1.0
// @description  去除流氓
// @author       WoIveRinE
// @match        *://www.77kpp.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/431839/REmove_badbad.user.js
// @updateURL https://update.greasyfork.org/scripts/431839/REmove_badbad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var kpp77 = /www.77kpp.com/
    var currentURL = window.location.href;

    setTimeout(function () {
        if(kpp77.test(currentURL)){
            document.getElementById("HMimageright").remove();
            document.getElementById("HMimageleft").remove();
            document.getElementById("note").remove();
            document.querySelector("body > div:nth-child(16)").remove();
        }
    }, 30);
})();