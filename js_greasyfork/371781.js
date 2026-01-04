// ==UserScript==
// @name         Rounded corners Facebook chat
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       Nylon
// @match        https://www.facebook.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/371781/Rounded%20corners%20Facebook%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/371781/Rounded%20corners%20Facebook%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here..
    $(window).on('load', function() {
        $('._1aa6').css('border-radius','8px');
        $('._5w1r').css('border-radius','8px');
    });
    $('body').on('DOMNodeInserted', function() {
        $('._5w1r._3_om._5wdf').css('border-radius','8px');
    });
})();