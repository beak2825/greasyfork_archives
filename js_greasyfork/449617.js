// ==UserScript==
// @name        Yahoo mail new message highlighter
// @namespace   https://mail.yahoo.com/
// @version      0.1
// @description Make new/unread messages in Yahoo mail obvious. Enhancements to make it look like the previous version of Yahoo mail are welcome.
// @author      https://tolstoy.com/
// @match        https://mail.yahoo.com/*
// @grant        none
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @run-at      document-end
// @license Apache2
// @downloadURL https://update.greasyfork.org/scripts/449617/Yahoo%20mail%20new%20message%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/449617/Yahoo%20mail%20new%20message%20highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery('#messageListContainer tbody tr').find("td:eq(1) span").each(function() {
        jQuery(this).parent().parent().find("td:eq(4) a").css({'font-size': '1.5rem'});
    });
})();
