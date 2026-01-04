// ==UserScript==
// @name         Kagi Search Token Enabler
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Enables Kagi.com Search token with personalized user settings
// @author       Streampunk
// @icon         data:image/png;base64,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
// @match        https://kagi.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498615/Kagi%20Search%20Token%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/498615/Kagi%20Search%20Token%20Enabler.meta.js
// ==/UserScript==

// Set your Kagi Search token here with personalized user settings
   var token = 'XXXXXXXXXX-your_token-XXXXXXXXXX';

// Set the custom settings value as activated for the script to work properly
   var user_settings = 'activated';

// A Function to Set a Cookie
function setCookie(cName, cValue) {
  const domain = "domain=kagi.com";
  document.cookie = cName + "=" + cValue + ";" + domain + ";";
}

// A Function to Get a Cookie
function getCookie(cName) {
  let Name = cName + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(Name) == 0) {
      return c.substring(Name.length, c.length);
    }
  }
  return "";
}

// A Function that Checks if a Cookie is set
function checkCookie() {
  let user = getCookie("user_settings");
  if (user != "") {
 // Remember to open the console (Press F12)
    console.error("Сookies with custom user settings are set!");
  } else {
 // Apply setCookie
    setCookie('kagi_session', token);
    setCookie('user_settings', user_settings);
    location.reload();
  }
}

// Check if Сookies are set and if not, set a Сookie with a user token
checkCookie();