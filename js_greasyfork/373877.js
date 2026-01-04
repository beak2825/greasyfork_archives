// ==UserScript==
// @name         Neopets PIN Autotyper
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      1.11
// @description  This types your pin in, read the title, nerd.
// @author       RealisticError (Clraik)
// @match        https://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373877/Neopets%20PIN%20Autotyper.user.js
// @updateURL https://update.greasyfork.org/scripts/373877/Neopets%20PIN%20Autotyper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var pin = "xxxx"; //Type pin in here

    if($("#pin_field").val() !== 'undefined'){
       
            $("#pin_field").val(pin);
       
    }
})();