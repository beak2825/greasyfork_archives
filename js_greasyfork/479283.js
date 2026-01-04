// ==UserScript==
// @name         GC - Esophagor No Double Click
// @namespace    https://greasyfork.org/en/users/1202961-13ulbasaur
// @version      0.1
// @description  Helps prevent accidental double clicking on esophagor buttons, so to prevent missing brain tree quest info.
// @author       Twiggies
// @match        *https://www.grundos.cafe/halloween/esophagor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479283/GC%20-%20Esophagor%20No%20Double%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/479283/GC%20-%20Esophagor%20No%20Double%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const buttons = document.querySelectorAll('input[type="button"]')
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() { this.disabled = true;
      setTimeout(function(){this.disabled = false;},5000); }, false);


    }
})();