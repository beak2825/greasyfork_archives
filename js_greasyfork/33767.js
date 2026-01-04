// ==UserScript==
// @name         Habitica Redesign 2017 Enhanced Notifications
// @namespace    http://nico-siebler.de/
// @version      0.1
// @description  Add notification check and count-update each 3 seconds to Habitica's system message notifcation area and adds a marking if notifications are still present
// @author       Nico Siebler <nico.siebler@googlemail.com>
// @match        https://habitica.com/*
// @grant        none
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/33767/Habitica%20Redesign%202017%20Enhanced%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/33767/Habitica%20Redesign%202017%20Enhanced%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {

        if (typeof jQuery !== "undefined") {

            // Re read content if content was replaced
            var notifyRootEl = jQuery('div.svg-icon.notifications');
            if (typeof notifyRootEl !== "undefined" && notifyRootEl.length > 0) {
                var notifySvgEl = notifyRootEl.find('svg path');
                var notifyDefaultFill = notifySvgEl.attr('defaultfill');
                if (! notifyDefaultFill) {
                    notifySvgEl.attr('defaultfill', notifySvgEl.attr('fill'));
                    notifyDefaultFill = notifySvgEl.attr('defaultfill');
                }
                if (jQuery('#dropdown-count').length === 0) {
                    notifyRootEl.append('<span id="dropdown-count"></span>');
                }

                var notifyMsgLen = jQuery('.dropdown-menu .dropdown-item .glyphicon-comment').length;
                if (notifyMsgLen) {
                    jQuery('#dropdown-count').html(notifyMsgLen);
                    notifySvgEl.attr('fill', '#FF0000');
                }
                else {
                    jQuery('#dropdown-count').html('');
                    notifySvgEl.attr('fill', notifyDefaultFill);
                }
            }
        }
    }, 3000);
})();