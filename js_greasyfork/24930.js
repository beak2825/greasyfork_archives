// ==UserScript==
// @name Gardner Demo
// @namespace IgnitionOne Scripts
// @description Hides Display Beta Icon and Legacy Display Nav
// @include /^https?://.*\.ignitionone\.com/.*$/
// @grant none
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/24930/Gardner%20Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/24930/Gardner%20Demo.meta.js
// ==/UserScript==
var sheet = window.document.styleSheets[0];
sheet.insertRule('#ione-navbar > nav > div > div > div:nth-child(4) > a > span > span.new-product-indicator.ng-scope { visibility: hidden; }', sheet.cssRules.length);
sheet.insertRule('#ione-navbar > nav > div > div > div:nth-child(5) { height: 0; }', sheet.cssRules.length);
sheet.insertRule('#ione-navbar > nav > div > a > span.new-product-indicator.ng-scope { visibility: hidden; }', sheet.cssRules.length);