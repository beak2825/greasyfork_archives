// ==UserScript==
// @name         OnlyFreeTurboSquid
// @namespace    https://www.laconicdesigns.com
// @version      0.1
// @description  I said free, that's what I meant.
// @author       UltraBlake
// @match        https://www.turbosquid.com/Search/3D-Models/*
// @match        https://www.turbosquid.com/Search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423719/OnlyFreeTurboSquid.user.js
// @updateURL https://update.greasyfork.org/scripts/423719/OnlyFreeTurboSquid.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var tsdivs = document.getElementsByTagName('div'); //All the divs after the page is loaded.

    for (var tsi = 0; tsi < tsdivs.length; tsi += 1) {
        //looping through all of the divs
        try {
            if (tsdivs[tsi].getAttribute("data-price").charAt(0) == "$") {
                //remove parents parent if the price of this isn't free
                tsdivs[tsi].parentNode.parentNode.parentNode.removeChild(tsdivs[tsi].parentNode.parentNode);
                //javascript is so elegant
            }
        }
        catch (error) {
            console.log ("ERROR CAUGHT!");
        }
}
})();