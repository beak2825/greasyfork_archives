// ==UserScript==
// @name         Balanz ccl
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  right click and run script
// @author       https://github.com/jose-velarde
// @match        https://customers.balanz.com/watchlists
// @icon         https://www.google.com/s2/favicons?sz=64&domain=balanz.com
// @grant        none
// @run-at       context-menu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474297/Balanz%20ccl.user.js
// @updateURL https://update.greasyfork.org/scripts/474297/Balanz%20ccl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ticker = document.querySelectorAll("tbody tr > td:nth-child(2) a");
    var compraCol = document.querySelectorAll("tbody tr > td:nth-child(5)");
    var ventaCol = document.querySelectorAll("tbody tr > td:nth-child(6)");
    var ultCol = document.querySelectorAll("tbody tr > td:nth-child(8)");

    let ventaCable = 1
    let compraPesos = 1

    //Iterate our cells
    for(var i = 1; i < ventaCol.length; i++){
        if (ticker[i-1].innerHTML.toString().endsWith("C") && ventaCol[i] != null && compraCol[i]){
            ventaCable = Number(ventaCol[i].innerHTML)
        } else {
            compraPesos = Number(compraCol[i].innerHTML)
        }

        if (ticker[i-1].innerHTML.toString().endsWith("C")) {
            ultCol[i].innerHTML = (compraPesos/ventaCable).toFixed(2);
        } else {
            ultCol[i].innerHTML = "";
        }
    }
})();