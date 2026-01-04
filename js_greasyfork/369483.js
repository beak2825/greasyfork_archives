// ==UserScript==
// @name        Epic-games/ Fortnight - no background image
// @namespace   english
// @description Epic-games/ Fortnight   no background image
// @include     http*://*epicgames.com*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/369483/Epic-games%20Fortnight%20-%20no%20background%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/369483/Epic-games%20Fortnight%20-%20no%20background%20image.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '           body, html, #accountPortalModalProductStyle{    background: #ccc !important;}          ';
document.getElementsByTagName('head')[0].appendChild(style);
