// ==UserScript==
// @name         Picshitz.com Bypasser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script bypasses the waiting delai of Picshitz.com.
// @author       MoBZ
// @license      MIT
// @match        *.picshitz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/439320/Picshitzcom%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/439320/Picshitzcom%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.querySelector("#btn-gotolink");

    if (typeof button != 'undefined') {
        let param = document.location.href.substr(document.location.href.indexOf("=") + 1);
        let realurl = aesCrypto.decrypt(convertstr(param), convertstr('root'));
        window.scrollTo(0, document.body.scrollHeight);
        window.location.replace(realurl);
    } else {
        console.log("Undefined");
    }
})();
