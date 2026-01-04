// ==UserScript==
// @name         jsArmagedon
// @version      0.1
// @description  jsArmagedon is script for Meteopress
// @author       You
// @match        http://armagedon.meteopress.cz/forms2/ppcr4.php?formid=3055
// @icon         https://www.google.com/s2/favicons?sz=64&domain=githubusercontent.com
// @grant        none
// @namespace https://greasyfork.org/users/911951
// @downloadURL https://update.greasyfork.org/scripts/444698/jsArmagedon.user.js
// @updateURL https://update.greasyfork.org/scripts/444698/jsArmagedon.meta.js
// ==/UserScript==

(function() {
    'use strict';

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var but = document.createElement("button");
but.addEventListener("click", function() {
        m.setZoom(7);
        m.setCenter(center);
}, false);

but.innerHTML = "Vycentrovat"

insertAfter(mapa, but);
    // Your code here...
})();