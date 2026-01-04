// ==UserScript==
// @name         sdologincheck
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  check the checkbox
// @author       editit
// @match        *://login.u.sdo.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sdo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455407/sdologincheck.user.js
// @updateURL https://update.greasyfork.org/scripts/455407/sdologincheck.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', (event) => {
        if(document.getElementById('isAgreementAccept'))
        {document.getElementById('isAgreementAccept').checked=true;}
    },false);
})();