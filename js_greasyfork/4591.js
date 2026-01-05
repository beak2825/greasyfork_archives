// ==UserScript==
// @name         Something Awful Friends Highlight
// @namespace    http://mathemaniac.org
// @version      1.0.1
// @description  Highlights posts of friends on Something Awful.
// @match        *://forums.somethingawful.com/usercp.php*
// @match        *://forums.somethingawful.com/showthread.php*
// @copyright    2012-2016, Sebastian Paaske Tørholm
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/4591/Something%20Awful%20Friends%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/4591/Something%20Awful%20Friends%20Highlight.meta.js
// ==/UserScript==

var location = "" + document.location;

// Scrape buddy list from user control panel
if (location.match(/usercp\.php/) && $('#buddylist').length) {
    var buddies = [];
    $('#buddylist a[href *= "member.php"]').each(function () {
        buddies.push($(this).attr('title'));
    });

    GM_setValue("buddylist", buddies);
} else {
    var buddies = GM_getValue("buddylist", []);

    $(".post").each( function () {
        console.log("Post: ", this);
        var author = $("dt.author", this);
        if (author && $.inArray(author.first().text(), buddies) >= 0) {
            $("tr td", this).css( {
                "background-color": "lightgreen"
            } );
        }
    } );
}
