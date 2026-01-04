// ==UserScript==
// @name        AP-intranet + open localhost in new tab
// @description  AP-intranet + open localhost in new tab.
// @namespace   english
// @include     http*://*globaljtbgroup.sharepoint.com/sites/AsiaPacific/Pages/Home.asp*
// @version     1.3
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502298/AP-intranet%20%2B%20open%20localhost%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/502298/AP-intranet%20%2B%20open%20localhost%20in%20new%20tab.meta.js
// ==/UserScript==

// Main - CSS added to header 


window.open("http://localhost", '_blank');



