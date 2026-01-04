// ==UserScript==
// @name         Mirror Creator Link Checker (Improved)
// @namespace    https://github.com/MeGaNeKoS/Mirror-Creator-Link-Checker
// @version      1.3
// @description  Why Check 1 by 1 if you can do automatically?
// @author       sharmanhall (Based on MeGaNeKo(めがねこ)'s script)
// @license      MIT
// @match        *://www.mirrored.to/files/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/466699/Mirror%20Creator%20Link%20Checker%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466699/Mirror%20Creator%20Link%20Checker%20%28Improved%29.meta.js
// ==/UserScript==

// Function to check links and click on the "Check" button
function checkLinks() {
  $('a[onclick^="showStatus"]').each(function() {
    $(this).click();
  });
}

// Check links periodically until there are no more
var myVar = setInterval(checkLinks, 1000);

// Stop checking when there are no more links to check
function stopChecking() {
  clearInterval(myVar);
}

// Call the stopChecking function when the trigger count is zero
$(document).ajaxStop(function() {
  if (trigger === 0) {
    stopChecking();
  }
});
