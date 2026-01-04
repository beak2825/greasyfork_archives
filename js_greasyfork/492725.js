// ==UserScript==
// @name        Advertisingexcel ~ Automatic
// @namespace   Violentmonkey Scripts
// @match       https://advertisingexcel.com/landing/
// @match       https://advertisingexcel.com/outgoing/
// @grant       none
// @version     1.0
// @author      leenox_Uzer
// @description 4/14/2024, 7:41:43 PM
// @downloadURL https://update.greasyfork.org/scripts/492725/Advertisingexcel%20~%20Automatic.user.js
// @updateURL https://update.greasyfork.org/scripts/492725/Advertisingexcel%20~%20Automatic.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    const continueButton = document.querySelector('button');
    continueButton.click();
}, false);