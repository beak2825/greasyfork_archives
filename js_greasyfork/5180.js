// ==UserScript==
// @author        Xiphias[187717]
// @name          Torn City - Attack Logs extension
// @description   This script adds a Next and Previous button to the Attack Logs page.
// @include       http://www.torn.com/attacklogs.php*
// @include       http://torn.com/attacklogs.php*
// @include       https://www.torn.com/attacklogs.php*
// @include       https://torn.com/attacklogs.php*
// @version       1.0.0
// @namespace https://greasyfork.org/users/3898
// @downloadURL https://update.greasyfork.org/scripts/5180/Torn%20City%20-%20Attack%20Logs%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/5180/Torn%20City%20-%20Attack%20Logs%20extension.meta.js
// ==/UserScript==

$(document).ready(function() {
    runScript();
});

function addButtons(currentUserID) {

    var prevUserID = Number(currentUserID) - 1;
    var nextUserID = Number(currentUserID) + 1;
    
    var before = '<a href="/attacklogs.php?ID=' + (prevUserID) + 
    '" style="float: left;"> &lt; Previous</a>';
    
    var after = '<a href="/attacklogs.php?ID=' + (nextUserID) + '" style="float: right;">Next &gt; </a>';

    $('center > a[href="events.php"]').before(before);
    $('center > a[href="events.php"]').after(after);
}

function runScript() {
    var currentUserID  = getUserID();
    addButtons(currentUserID);
}

function getUserID() {
    var path = window.location;
    var search = path.search;
    var userID = search.substring(search.indexOf('ID=')+3);

    return userID;
}



