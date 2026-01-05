// ==UserScript==
// @name         Facebook message count
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Show facebook message count on https://www.facebook.com/messages
// @author       Tomáš Falešník
// @match        https://www.facebook.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @license      MIT license
// @downloadURL https://update.greasyfork.org/scripts/25084/Facebook%20message%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/25084/Facebook%20message%20count.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Show message count for facebook.com/messages page
    setInterval(function() {
        if (window.location.href.indexOf("facebook.com/messages") != -1) {
            var messageHeader = $("#webMessengerHeaderName");
            console.log(messageHeader);
            if (messageHeader.length) {
                var messageCount = $("._7hx > span").html();
                if (!$("#messageCount").length) {
                    $('<h2 class="_r7" style="max-width: 286px; font-size: 13px;"> (<span id="messageCount"></span> messages)</h2>').insertAfter(messageHeader);
                }
                $("#messageCount").html(parseInt(messageCount) + $("#webMessengerRecentMessages").find(".webMessengerMessageGroup").find("._3hi").length + $("#webMessengerRecentMessages").find("._4mnv").length);
            }
        }
    }, 500);
})();