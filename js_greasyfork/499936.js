// ==UserScript==
// @name        Swiftuploads - Remove Ads
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1
// @description  Deletes the "ads" button if an "org" button exists, or removes the onclick attribute from "ads" if it's alone. Also removes "hidden" class from "org" button.
// @author       JRem
// @match        https://www.swiftuploads.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499936/Swiftuploads%20-%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/499936/Swiftuploads%20-%20Remove%20Ads.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const orgButton = document.getElementById('org');
  const adsButton = document.getElementById('ads');

  if (orgButton) {
    adsButton.remove();
    orgButton.classList.remove('hidden'); // Remove hidden class
  } else if (adsButton) {
    adsButton.removeAttribute('onclick');
  }
})();