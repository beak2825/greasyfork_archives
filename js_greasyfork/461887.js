// ==UserScript==
// @name         Calculate real Saldo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BMCE gives you your saldo and all blockages, but will not tell you how much of your money is available afterwards.
// @author       You
// @match        https://www.bmcedirect.ma/en/banque/mouvements.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bmcedirect.ma
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461887/Calculate%20real%20Saldo.user.js
// @updateURL https://update.greasyfork.org/scripts/461887/Calculate%20real%20Saldo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nodes = document.querySelectorAll("div.ei_blcdata_half p span._c1");
    var total = parseFloat(nodes[0].innerText.replace(/,/g, '').replace(/\ MAD/g, ''));
    var blockages = parseFloat(nodes[1].innerText.replace(/,/g, '').replace(/\ MAD/g, ''));
    console.log("Usable: " + (total + blockages));
    nodes[0].parentNode.append("(Usable: " + (total + blockages).toString() + ")");

})();
