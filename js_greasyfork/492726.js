// ==UserScript==
// @name        Adlink ~ Automatic Bypass
// @namespace   Violentmonkey Scripts
// @match       https://www.maqal360.com/*
// @match       https://diudemy.com/*
// @grant       none
// @version     1.0
// @author      leenox_Uzer
// @description 4/15/2024, 3:05:56 PM
// @downloadURL https://update.greasyfork.org/scripts/492726/Adlink%20~%20Automatic%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/492726/Adlink%20~%20Automatic%20Bypass.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  const scriptTagToScrape = document.querySelector("body > script:nth-child(22)").innerText;
  const actualLink = scriptTagToScrape.match(/var\s+dataFromPHP\s*=\s*"([^"]+)"/)[1].replace(/\\/g, "");
  if (actualLink) {
    window.open(actualLink, "_self")
  } else {
    // If on step 7
    document.querySelector("#_append > a").click()
  }

}, false)