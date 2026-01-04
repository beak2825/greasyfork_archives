// ==UserScript==
// @name         Google Timeline Auto Download
// @version      1.0.0
// @description  Auto download your Timeline (Maps locations) from Google Takeout.
// @author       Zennar
// @match        https://takeout.google.com/*
// @grant        none
// @icon         https://www.google.com/favicon.ico
// @run-at       document-end
// @license      CC0
// @namespace https://greasyfork.org/users/1397386
// @downloadURL https://update.greasyfork.org/scripts/517624/Google%20Timeline%20Auto%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/517624/Google%20Timeline%20Auto%20Download.meta.js
// ==/UserScript==


// Un-check the selection, so no items are selected
document.querySelector('div[role=tabpanel] > div > div > div > div> div:nth-of-type(2) > div > button').click();

// Tap on the second checkbox with the Maps logo
document.querySelector('div[data-is-visible="true"]:has(img[src="https://www.gstatic.com/images/branding/product/1x/maps_48dp.png"])').nextElementSibling.querySelector('input').click()

// Finally click on the submit button at the bottom
document.querySelector('#i7 > div > div > div > div > button').click()