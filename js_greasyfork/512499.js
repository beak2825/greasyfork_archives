// ==UserScript==
// @name        Change Logo Link of hianime.to
// @namespace   roxyscripts
// @match       https://hianime.to/*
// @grant       none
// @version     1.2
// @description  Change the logo link from "/" to "/home"
// @author      roxy
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/512499/Change%20Logo%20Link%20of%20hianimeto.user.js
// @updateURL https://update.greasyfork.org/scripts/512499/Change%20Logo%20Link%20of%20hianimeto.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to change the href attribute
    function changeLogoLink() {
        document.getElementById('logo')?.setAttribute('href', '/home');
    }

    // Run the function after the page has loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', changeLogoLink);
    } else {
        changeLogoLink();
    }
})();