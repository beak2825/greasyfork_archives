// ==UserScript==
// @name        Mathworks no select country
// @namespace   org.spineeye
// @description Disable country selection nag which comes up every time if cookies are deactivated
// @include     https://*.mathworks.com/*
// @include     http://*.mathworks.com/*
// @version     1.0.1
// @grant       
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/22051/Mathworks%20no%20select%20country.user.js
// @updateURL https://update.greasyfork.org/scripts/22051/Mathworks%20no%20select%20country.meta.js
// ==/UserScript==

// this is only possible with no @grant and @run-at document-start
// see https://wiki.greasespot.net/Content_Script_Injection
window.overrideDomainSelector = true;

/*
GM_addStyle("#country-unselected { display: none !important; }");

var waitForNag = setInterval(function() {
  if (document.querySelector("#country-unselected")) {
    clearInterval(waitForNag);
    
    console.log(document.querySelector("#country-unselected"));
    
    document.body.className = document.body.className.replace( /(?:^|\s)modal-open(?!\S)/, "");
  }
}, 10);
*/