// ==UserScript==
// @name Nuevo checkout
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Habilitar nuevo checkout
// @author You
// @match https://www.stradivarius.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/433246/Nuevo%20checkout.user.js
// @updateURL https://update.greasyfork.org/scripts/433246/Nuevo%20checkout.meta.js
// ==/UserScript==


if((typeof ItxCheckoutPageClass != 'undefined' || typeof ItxCheckoutConfirmationPageClass != 'undefined') && typeof inditex != 'undefined'){
ItxCheckoutPageClass.isNewCheckout = function() { return 1; }
ItxCheckoutConfirmationPageClass.isNewConfirmation = function() { return 1; }
inditex.iGooglePlacesEnabled = true;
}