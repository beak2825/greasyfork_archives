// ==UserScript==
// @name        Autofocus login salesforce
// @namespace   Salesforce tools
// @match       https://*.my.salesforce.com/_ui/identity/verification/method/TotpVerificationUi/e*
// @grant       none
// @version     1.1
// @author      Fab1can
// @description 02/01/2025, 08:36:39
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522568/Autofocus%20login%20salesforce.user.js
// @updateURL https://update.greasyfork.org/scripts/522568/Autofocus%20login%20salesforce.meta.js
// ==/UserScript==
document.evaluate("//input[contains(@class, 'input wide mb8 mt8 focus')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.focus();