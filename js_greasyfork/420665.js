// ==UserScript==
// @name         Card_Kingdom_Buy_Qty_Display
// @namespace    https://www.cardkingdom.com/
// @version      0.6
// @description  Security through obfuscation is bad, m'kay.
// @author       Halt_I_m_Reptar (MtG Cabal Cast)
// @match        */purchasing/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420665/Card_Kingdom_Buy_Qty_Display.user.js
// @updateURL https://update.greasyfork.org/scripts/420665/Card_Kingdom_Buy_Qty_Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.getElementsByClassName("dropdown-menu qtyList")).forEach((cardNode, index) => {
        //document.getElementsByClassName("stylePrice")[index].innerHTML += '<div style="font-weight:bold; color:#0b0; float: right">' + cardNode.innerHTML.split('<li>').pop().split('</li>')[0] + '</div>';
        var spanStylePrice = document.getElementsByClassName("stylePrice")[index].innerHTML;
        document.getElementsByClassName("stylePrice")[index].innerHTML = '<div style="font-weight:bold; color:#0b0; float: left; font-size: 12pt;">' + cardNode.innerHTML.split('<li>').pop().split('</li>')[0] + '</div>' + spanStylePrice;
    });

})();
