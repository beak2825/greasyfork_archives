// ==UserScript==

// @name                Google Drive - Default Text in Search Field
// @description         Pre-populate Google Drive search field with some custom text (default: "* type:folder") for easier searching.
// @version             1.1

// @namespace           io.github.ni554n
// @match               https://drive.google.com/*
// @run-at              document-idle

// @supportURL          https://github.com/ni554n/userscripts/issues
// @license             MIT

// @author              Nissan Ahmed
// @homepageURL         https://ni554n.github.io/
// @contributionURL     https://paypal.me/ni554n

// @downloadURL https://update.greasyfork.org/scripts/433481/Google%20Drive%20-%20Default%20Text%20in%20Search%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/433481/Google%20Drive%20-%20Default%20Text%20in%20Search%20Field.meta.js
// ==/UserScript==

// Change this text to customize the default text.
const INPUT_PLACEHOLDER = "* type:folder";

const isLogEnabled = false;

const searchInputElement = document.querySelector(`input[aria-label="Search in Drive"]`);
const titleElement = document.head.getElementsByTagName("title")[0];

// Don't know why but any userscript on Google Drive executes twice.
// First time normally but on the second call, every getElementsBy*() returns null.
if (searchInputElement) {
  // Pre-fill the input for the first load.
  searchInputElement.value ||= INPUT_PLACEHOLDER;

  // Google Drive is an SPA where page navigation is done dynamically via javascript.
  // Page navigations can be detected by observing the <title> changes.
  new MutationObserver(observePageNavigation).observe(
    titleElement,
    { childList: true },
  );
}

function observePageNavigation() {
  log(`Page Route Changed -> ${titleElement.text}`);

  searchInputElement.value ||= INPUT_PLACEHOLDER;
}

function log(message) {
  if (isLogEnabled) console.log(message);
}
