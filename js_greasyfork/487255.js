// ==UserScript==
// @name         PTP Unfollow Forums
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  This will allow you to automatically mark new posts as read for the designated forums, thus effectively "unfollowing" them. Please see the unfollowedForumIds variable in the script.
// @author       TerminatioN
// @license      MIT
// @match        https://passthepopcorn.me/forums.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=passthepopcorn.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487255/PTP%20Unfollow%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/487255/PTP%20Unfollow%20Forums.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

$(document).ready(function() {
    console.log('PTP-UF>  PTP Unfollow Forums script running.');

    //Change these to match the forum IDs you want to unfollow.
    //Example: 33 = PTP Contests, 40 = Forum Games
    //const unfollowedForumIds = [33,40];
    const unfollowedForumIds = []; //Uncomment the above and delete this line or use your own.

    const isAlreadyCaughtUp = JSON.parse(localStorage.getItem("isAlreadyCaughtUp")) === true;
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const pageNum = urlParams.get('page');
    const pageHasNoResults = ($('.panel__body .text--center').text() == '\n\t\t\t\t\tNo topics with unread posts\n\t\t\t\t');

    if (action !== null && action == 'unread_topics') {

        console.log('PTP-UF>  Unread topics page detected.');

        if (pageHasNoResults && pageNum !== null && pageNum > 1) {
            window.location.href = window.location.href.replace('page='+pageNum, 'page='+(pageNum-1));
        }

        if (isAlreadyCaughtUp) {
            console.log('PTP-UF>  Auto-read function has already run. Enjoy!');
            localStorage.setItem("isAlreadyCaughtUp", false);
        }
        else {
            MarkUnfollowedForumsRead(unfollowedForumIds);
        }
    }

    function MarkUnfollowedForumsRead( forumIds, time )
    {
        var promises = [];
        $.each(forumIds, function(index, forumIdVal) {

            var postData = { "action": "catchup", "forumid": forumIdVal };

            if ( typeof( time ) !== "undefined" ) {
                postData["time"] = time;
            }

            promises.push(
                $.ajax(
                {
                    url: "forums.php",
                    type: "POST",
                    data: AddAntiCsrfTokenToPostData( postData ),
                })
            );
        });

        $.when.apply($, promises).then(function() {
            console.log('PTP-UF>  All specified forums to unfollow have been marked as read.');
            localStorage.setItem("isAlreadyCaughtUp", true);
            document.location.reload();
        });
    }
});