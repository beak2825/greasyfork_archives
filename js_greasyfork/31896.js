// ==UserScript==
// @name         Carrefour - Better prices display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  better prices display
// @author       Romain Racamier-Lafon
// @match        https://courses-en-ligne.carrefour.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31896/Carrefour%20-%20Better%20prices%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/31896/Carrefour%20-%20Better%20prices%20display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function apply(){
        console.log('bkp - apply');
        var els = document.querySelectorAll('.cd-ProductPriceUnit, .cd-ProductPriceReference');
        els.forEach(function(el) {
            if(!el.classList.contains('bkp-processed')){
                el.classList.add('bkp-processed');
                el.classList.toggle('cd-ProductPriceUnit');
                el.classList.toggle('cd-ProductPriceReference');
                el.innerHTML = el.innerHTML.replace('/ Kilogramme','<small>/ Kg</small>');
            }
        });
        els = document.querySelectorAll('.cd-ProductPriceUnitInteger');
        els.forEach(function(el) {
            el.classList.remove('cd-ProductPriceUnitInteger');
        });
    }

    setInterval(apply, 1000);

})();