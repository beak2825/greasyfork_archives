// ==UserScript==
// @name        Suomi.fi autocontinue
// @namespace   suomi_fi_autocontinue
// @description Presses the 'Jatka palveluun' button because needing to press that button is stupid.
// @include     https://tunnistautuminen.suomi.fi/idp/profile/SAML2/*
// @version     0.0.2
// @grant       none
// @icon        https://www.google.com/s2/favicons?sz=64&domain=suomi.fi
// @downloadURL https://update.greasyfork.org/scripts/473322/Suomifi%20autocontinue.user.js
// @updateURL https://update.greasyfork.org/scripts/473322/Suomifi%20autocontinue.meta.js
// ==/UserScript==

var target_button = "";
var retry_time = 500;
var tries = 0;

function click_target_button() {
  target_button = document.getElementById('continue-button');
  if (target_button) {
    target_button.click();
  } else {
    console.log("Waiting for the button to appear... Tried " + tries + " times.");
    setTimeout(click_target_button, retry_time);
  }
}

setTimeout(click_target_button, retry_time);