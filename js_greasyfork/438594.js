// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  script para converter o valor do dolar no site da bolsa de chicago.
// @author       Dalcio
// @match        https://www.cmegroup.com/markets/fx/emerging-market/brazilian-real.contractSpecs.html
// @icon         https://www.google.com/s2/favicons?domain=cmegroup.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438594/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/438594/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var x = document.getElementsByClassName("last-value");
    let y = 1 / parseFloat(x[0].outerText);
    x[0].innerHTML=y;

   
    // alert("novo");


})();