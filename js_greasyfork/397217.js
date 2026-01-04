// ==UserScript==
// @name        Load .gsheet link from local file
// @version     0.2
// @description Discover Google Docs link in .gsheet file and navigate to it. 2020-03-02.
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2020 Jefferson Scher
// @license     BSD-3-Clause
// @match       file:///*/*
// @grant       GM_registerMenuCommand
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/397217/Load%20gsheet%20link%20from%20local%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/397217/Load%20gsheet%20link%20from%20local%20file.meta.js
// ==/UserScript==

function loadSheet(){
    // Parse document text as JSON
  var oSheetInfo = JSON.parse(document.body.textContent);
  // Replace current page with linked page
  if (oSheetInfo.url.indexOf('https://docs.google.com/') === 0){
    // Go directly to HTTPS link
    location.replace(oSheetInfo.url);
  } else if (oSheetInfo.url.indexOf('http://docs.google.com/') === 0){
    // Upgrade HTTP link
    location.replace(oSheetInfo.url.replace('http://', 'https://'));
  } else {
    // Ask user about WTF link
    if (confirm('Navigate to "' + oSheetInfo.url + '"?')){
      location.replace(oSheetInfo.url);
    }
  }
}

// Detect documents whose paths end with .gsheet and run loadSheet(), add menu item
if (location.pathname.indexOf('.gsheet') > -1 && location.pathname.slice(-7) == '.gsheet'){
  window.setTimeout(loadSheet, 50);
  // This should work in Violentmonkey and Tampermonkey, but unfortunately not Greasemonkey.
  try {
    GM_registerMenuCommand("Navigate now", loadSheet);
  } catch (err) {
    console.log('Error adding Load .gsheet from local file menu items: ' + err.message);
  }
}
