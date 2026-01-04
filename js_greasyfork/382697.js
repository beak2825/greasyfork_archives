// ==UserScript==
// @name         asuto buy MI
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       You
// @match        https://buy.mi.co.id/id/buy/product/pocophone-f1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382697/asuto%20buy%20MI.user.js
// @updateURL https://update.greasyfork.org/scripts/382697/asuto%20buy%20MI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        document.querySelectorAll('p.name.J_name')[0].click();
    }, 2000);

    setTimeout(function() {
        document.querySelectorAll('p.name.J_name')[2].click();
    }, 4000);

   setTimeout(function() {
       var cekText = document.querySelector('a#J_nextBtn.button.active.btn-primary').innerText;
       if(cekText == 'BELI SEKARANG') {
           document.querySelectorAll('a#J_nextBtn.button.active.btn-primary')[0].click();
        }
   }, 6000);

})();