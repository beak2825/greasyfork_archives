// ==UserScript==
// @name         Robin Enhancement Suite
// @namespace    http://github.com/teknogeek
// @version      0.6.1
// @description  Trying to make Robin more awesome (revised by teknogeek)
// @author       teknogeek
// @credits      sprngr
// @match        https://www.reddit.com/robin*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18456/Robin%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/18456/Robin%20Enhancement%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var notifications = $('.robin-chat--sidebar-widget.robin-chat--notification-widget');
    var vote = $('.robin-chat--sidebar-widget.robin-chat--vote-widget');
    var resWidget = [
        '<h2 style="display:inline-block;"><span class="count"></span> Participants</h2>',
        '<p style="display:inline-block; padding-left:5px;"><small>(<span class="active"></span> Active / <span class="away"></span> Away)</small></p>',
        '<h3 style="margin: 5px 0px;"><span class="abandon-count"></span> Abandon | ',
        '<span class="stay-count"></span> Stay | ',
        '<span class="grow-count"></span> Grow | ',
        '<span class="novote-count"></span> No Vote</h3>'
    ].join("");

    notifications.prepend(resWidget);

    $('.robin--username :not(a)').each(function(index) {
        var username = $(this).text();
        if (username != '[robin]') {
            $(this).html('<a href="//reddit.com/u/' + username + '">' + username + '</a>');
        }
    });
    var reapTime = parseInt(document.head.innerHTML.match(/"robin_room_reap_time": "([^"]+)"/)[1]);
    vote.prepend('<h2 style="display:inline-block;"><span id="timeLeftMinutes"></span>min <span id="timeLeftSeconds"></span>sec remaining</h2>');

    update();

    function update() {
        // Total, Active/Away
        var reapSeconds = (reapTime - Date.now()) / 6e4,
            minutes = reapSeconds | 0,
            seconds = ((reapSeconds - minutes) * 60) | 0;
        $("#timeLeftMinutes").text(minutes);
        $("#timeLeftSeconds").text(seconds);

        var participantTotal = $('.robin-room-participant').length;
        var participantActive = $('.robin-room-participant.robin--presence-class--present').length;
        var participantAway = $('.robin-room-participant.robin--presence-class--away').length;

        var abandonCount = $('.robin-room-participant.robin--vote-class--abandon').length;
        var growCount = $('.robin-room-participant.robin--vote-class--increase').length;
        var stayCount = $('.robin-room-participant.robin--vote-class--continue').length;
        var noVoteCount = $('.robin-room-participant.robin--vote-class--novote').length;

        $('.robin-chat--notification-widget h2 .count').text(participantTotal);
        $('.robin-chat--notification-widget small .active').text(participantActive);
        $('.robin-chat--notification-widget small .away').text(participantAway);

        $('.robin-chat--notification-widget h3 .abandon-count').text(abandonCount);
        $('.robin-chat--notification-widget h3 .stay-count').text(stayCount);
        $('.robin-chat--notification-widget h3 .grow-count').text(growCount);
        $('.robin-chat--notification-widget h3 .novote-count').text(noVoteCount);

        $('.robin--username').each(function(index) {
            var username = $(this).text();
            if (username != '[robin]') {
                $(this).html('<a style="color:inherit;" target="_blank" href="//reddit.com/u/' + username + '">' + username + '</a>');
            }
        });

        setTimeout(update, 500);
    }
})();