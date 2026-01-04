// ==UserScript==
// @name         Scroll Hotfix
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  Hotfix
// @author       You
// @match        https://my.serviceautopilot.com/v3/CRM/MessageCenter
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509978/Scroll%20Hotfix.user.js
// @updateURL https://update.greasyfork.org/scripts/509978/Scroll%20Hotfix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).arrive(".l-messageCenter-column.messageCenter-column-main-right", function() {
        $(".l-messageCenter-column.messageCenter-column-main-right").css("overflow","scroll");
    })
})();