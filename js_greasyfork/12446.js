// ==UserScript==
// @name        Outlook MailChecker 2
// @namespace   Outlook
// @description Checks for new mails arriving in owa and provides a desktop notification. Works in most scenarios.
// @include     https://outlook.office.com/owa*
// @author      Cladius Fernando
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12446/Outlook%20MailChecker%202.user.js
// @updateURL https://update.greasyfork.org/scripts/12446/Outlook%20MailChecker%202.meta.js
// ==/UserScript==

/*
 * Loads the actual mail-checker script from https://greasyfork.org/en/scripts/12445-outlook-mailchecker/code. 
 * For some reason the actual script when installed by itself was not working. Hence, this simple workaround.
 */
var e = document.createElement("script");
e.src = 'https://greasyfork.org/scripts/12445-outlook-mailchecker/code/Outlook%20MailChecker.user.js';
e.type="text/javascript";
document.getElementsByTagName("head")[0].appendChild(e);