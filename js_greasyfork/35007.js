// ==UserScript==
// @name Gmail bye Zoho
// @match https://mail.google.com/mail/*
// @description  Remove bullshit
// @version      2017.11.10
// @namespace    greasy
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/35007/Gmail%20bye%20Zoho.user.js
// @updateURL https://update.greasyfork.org/scripts/35007/Gmail%20bye%20Zoho.meta.js
// ==/UserScript==

var s = document.createElement('style');
s.textContent = `

img[src*='zoho\.com'],
img[src*='zoho\.com'] ~ *,
iframe[src*='googleusercontent\.com\/gadgets'] {
  display: none;
}

`;

document.documentElement.appendChild(s);