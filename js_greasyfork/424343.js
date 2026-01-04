// ==UserScript==
// @name         FCPortable NagRemover
// @version      1.0.3
// @description  Remnove popup detection for fcportables.com and auto-redirect to the download page.
// @author       MooreR [http://moorer-software.com]
// @include      https://*fcportables.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/424343/FCPortable%20NagRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/424343/FCPortable%20NagRemover.meta.js
// ==/UserScript==

// Wait for jQuery to load and element with class containing "popup" to become available
function waitForPopupElement() {
  if (typeof jQuery == 'undefined') {
    setTimeout(waitForPopupElement, 100);
  } else {
    removePopupElements();
  }
}

// Remove elements with class containing "popup"
function removePopupElements() {
  var targetClass = 'popup';
  var targetElements = $('*[class*="' + targetClass + '"]');
  targetElements.remove();
}

// Retry until the element is available
function retryUntilAvailable() {
  var targetClass = 'popup';
  var targetElements = $('*[class*="' + targetClass + '"]');

  if (targetElements.length === 0) {
    setTimeout(retryUntilAvailable, 100);
  } else {
    removePopupElements();
  }
}

// Check if the current URL contains 'xurl'
if (document.URL.indexOf('xurl') !== -1) {
  // Automatically redirect to download page
  var dlLink = FinishMessage.split('<a href="')[1].split('"')[0];
  document.location = dlLink;
}

// Wait for the page to load and jQuery to become available
waitForPopupElement();

// Retry until the element is available
retryUntilAvailable();