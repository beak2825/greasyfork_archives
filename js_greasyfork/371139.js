// ==UserScript==
// @name         Gmail to Inbox
// @namespace    https://github.com/Inchworm333
// @version      0.2
// @description  Change the Gmail button back to Inbox (thanks google for removing that)
// @author       Inchworm333
// @icon         https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/ic_product_inbox_16dp_r2_2x.png
// @license      MIT
// @match        https://www.google.com
// @match        https://www.google.com/webhp?authuser=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371139/Gmail%20to%20Inbox.user.js
// @updateURL https://update.greasyfork.org/scripts/371139/Gmail%20to%20Inbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var gmailButton = document.querySelectorAll('[data-pid="23"]')[0];

    var gmailURL = new URL(gmailButton.href);

    gmailButton.href = 'https://inbox.google.com/u/' + gmailURL.searchParams.get("authuser");

    gmailButton.text = "Inbox";

})();
