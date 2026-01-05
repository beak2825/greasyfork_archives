// ==UserScript==
// @name         JIRA Count My Points
// @namespace    http://ww.kalee.hu
// @version      0.0.2
// @description  Counting the story points I have delivered.
// @author       Moondancer83
// @include      /jira.*/secure/RapidBoard.jspa*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26984/JIRA%20Count%20My%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/26984/JIRA%20Count%20My%20Points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var colors = {
        pointCounter: "#ccccff"
    };
    var head = $("head");
    var username = $("#header-details-user-fullname").data('username');

    setTimeout(function() {
        setStyles();
        countMypoints();
    }, 2000);

    function setStyles() {
        head.append("<style>" +
                    ".aui-badge.point-counter {background-color:" + colors.pointCounter + "} " +
                    "</style>");
    }
    function countMypoints() {
        var points = 0;
        var myPoints = 0;

        $(".ghx-backlog-container.ghx-sprint-active .ghx-end img.ghx-avatar-img")
            .next("[title='Story Points']")
            .toArray()
            .forEach(
            (item) => {
                var point = parseInt($(item).text());
                if (!isNaN(point)) {
                    points += point;
                }
            });

        $(".ghx-backlog-container.ghx-sprint-active .ghx-end img[src*=" + username +"].ghx-avatar-img")
            .next("[title='Story Points']")
            .toArray()
            .forEach(
            (item) => {
                var point = parseInt($(item).text());
                if (!isNaN(point)) {
                    myPoints += point;
                }
            });

        var badge = '<span class="aui-badge point-counter" title="Points (my/all): ' + myPoints + ' / ' + points + '">' + myPoints + ' / ' + points + '</span>';
        $('.ghx-badge-group').prepend(badge);
    }
})();