// ==UserScript==
// @name         jsArmagedon
// @version      0.1
// @description  jsArmagedon for Meteopress
// @author       You
// @match        http://armagedon.meteopress.cz/forms2/ppcr*.php?formid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=githubusercontent.com
// @grant        none
// @namespace https://greasyfork.org/users/911951
// @downloadURL https://update.greasyfork.org/scripts/444700/jsArmagedon.user.js
// @updateURL https://update.greasyfork.org/scripts/444700/jsArmagedon.meta.js
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