// ==UserScript==
// @name         GT - Check if Gifts/Invites exist
// @version      2.0
// @description  GT script to check for badges to accept and send, and also to check if there are any friend invites
// @author       Rani Kheir
// @include      *www.ghost-trappers.com/fb/hunt.php*
// @include      *www.ghost-trappers.com/fb/camp.php*
// @namespace    https://greasyfork.org/users/4271
// @downloadURL https://update.greasyfork.org/scripts/19194/GT%20-%20Check%20if%20GiftsInvites%20exist.user.js
// @updateURL https://update.greasyfork.org/scripts/19194/GT%20-%20Check%20if%20GiftsInvites%20exist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var x = $.get("/fb/request_badges.php", function( response ) {
        // get response text
        var y = x.responseText;

        // get string to check for matches
        var strToCheck = y.substring(y.search('requests_from_my_friends_headline.jpg'), y.search('requests_from_my_friends_headline.jpg') + 485);

        // caching DOM and creating paragraph (now link) element, declating text node
        var locationToAppend = document.getElementById("huntLinkTopMarker");
        var para = document.createElement("A");
        var t;

        // removing disruptive elements (at the moment they do not show anyway)
        try {
            document.getElementsByClassName("talentReminder")[0].remove();
            document.getElementsByClassName("talentReminderArrow")[0].remove();
        } catch (e) {}

        // if string contains this string (gifts available to accept)
        if (strToCheck.match(/index_intern/)) {
            t = document.createTextNode("You have Badges to accept!");
            para.href = "/fb/request_badges.php";
            para.title = "Go to Gifts page..";
            para.appendChild(document.createElement("BR"));
            para.appendChild(document.createElement("BR"));
            para.appendChild(document.createElement("BR"));
            para.appendChild(t);
            para.style.color = "white";
            para.style.padding = "3px 0px 0px 15px";
            para.style.display = "block";
            locationToAppend.appendChild(para);

        // else if you can send gifts
        } else if (y.search('id="requestCounter1">0<') < 0) {
            t = document.createTextNode("You have Badges to send!");
            para.href = "/fb/request_badges.php";
            para.title = "Go to Gifts page..";
            para.appendChild(document.createElement("BR"));
            para.appendChild(document.createElement("BR"));
            para.appendChild(document.createElement("BR"));
            para.appendChild(t);
            para.style.color = "white";
            para.style.padding = "3px 0px 0px 15px";
            para.style.display = "block";
            locationToAppend.appendChild(para);

        // else check for team requests
        } else {
            var dxy = $.get("/fb/scores.php?type=myteam", function( response2 ) {
                var dyy = dxy.responseText;
                if (dyy.search('team invite.') > 0) {
                    t = document.createTextNode("You have a GT friend invite!");
                    para.href = "/fb/invite_friend_into_team.php";
                    para.title = "Go to Team Requests page..";
                    para.appendChild(document.createElement("BR"));
                    para.appendChild(document.createElement("BR"));
                    para.appendChild(document.createElement("BR"));
                    para.appendChild(t);
                    para.style.color = "white";
                    para.style.padding = "3px 0px 0px 15px";
                    para.style.display = "block";
                    locationToAppend.appendChild(para);
                }
            });
        }
    });
})();