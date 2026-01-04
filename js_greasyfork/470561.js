// ==UserScript==
// @name        Print  for free - schoolmouv.fr
// @namespace   Violentmonkey Scripts
// @match       https://www.schoolmouv.fr/eleves/cours/*
// @grant       none
// @version     1.0
// @author      GourouLubrik
// @license MIT
// @description Script that let you print content without a subscription by bypassing CSS
// @downloadURL https://update.greasyfork.org/scripts/470561/Print%20%20for%20free%20-%20schoolmouvfr.user.js
// @updateURL https://update.greasyfork.org/scripts/470561/Print%20%20for%20free%20-%20schoolmouvfr.meta.js
// ==/UserScript==
function whenReady() {
    return new Promise((resolve) => {
        function completed() {
            window.removeEventListener('load', completed);
            resolve();
        }

        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', completed);
        }
    });
}


whenReady().then(() => {
console.log('Print for free - schoolmouv.fr script execution');
document.querySelectorAll('.dynamic-round-button').forEach(item => item.remove() )
var override = document.createElement("style");
override.innerText = "@media print { div.resource-page {  display: block !important; } .other-degree-alert .dynamic-round-button { display: none !important; }} ";
document.head.appendChild(override);

});
