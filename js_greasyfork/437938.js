// ==UserScript==
// @name         ElementaryOS - Remove paywall
// @namespace    https://github.com/Synaelle/ElementaryOS-nopaywall
// @version      1.02
// @description  It removes the fake paywall on ElementaryOS website
// @author       Synaelle
// @match        https://elementary.io/*
// @icon         https://elementary.io/favicon.ico
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/437938/ElementaryOS%20-%20Remove%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/437938/ElementaryOS%20-%20Remove%20paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //I don't think three "duplicate" lines of commands is worth an array
    document.getElementById("payment-trust").style.display = 'none';
    document.getElementById("choice-buttons").style.display = 'none';
    document.getElementById("pay-what-you-want").style.display = 'none';
    //If you don't choose any value, they will put 20$ if you click buy. So that's how I found a workaround for this.
    document.getElementById("amount-twenty").value = '0';
    document.getElementById('translate-purchase').innerHTML = document.getElementById('translate-download').innerHTML;
}

)();
