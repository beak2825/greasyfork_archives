// ==UserScript==
// @name            Disable Gumtree Advertisement Consent
// @description     Disable the automatic checking of the advertisement consent checkbox when replying to ads. This only affects visitors that are not logged in.
// @author          drsh0
// @include         https://*.gumtree.com.au/s-ad/*
// @run-at          document-end
// @version         0.0.2
// @noframes
// @namespace https://greasyfork.org/users/393803
// @downloadURL https://update.greasyfork.org/scripts/391823/Disable%20Gumtree%20Advertisement%20Consent.user.js
// @updateURL https://update.greasyfork.org/scripts/391823/Disable%20Gumtree%20Advertisement%20Consent.meta.js
// ==/UserScript==


function toggleConsent() {
  // create var attr that reads details about the checkbox in the page
  var attr = document.getElementsByClassName('checkbox__label')[0];
  if (attr === undefined) {
  	// do nothing
  } else {
  	// click the checkbox to turn consent off
    attr.click();
  }

}
toggleConsent();