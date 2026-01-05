// ==UserScript==
// @name         Filter oper.ru comments by user's name
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://oper.ru/*read.php*
// @grant        none
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/13540/Filter%20operru%20comments%20by%20user%27s%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/13540/Filter%20operru%20comments%20by%20user%27s%20name.meta.js
// ==/UserScript==


$(document).ready(function() {
    'use strict';

    var otherCommentsHidden = false;

    function getUsername(commentTable) {
        return $(commentTable).find('a:first').text().trim();
    }

    function iterateComments(markHidden, usernameToDisplay) {
        $('.comment').each(function(index, commentTable) {
            var username = getUsername(commentTable);

            if (markHidden && usernameToDisplay != username) {
                $(commentTable).hide();
            }
            else if (!markHidden) {
                $(commentTable).show();
            }
        });
        otherCommentsHidden = !otherCommentsHidden;
    }

    $('.comment').each(function(index, commentTable) {
        var username = getUsername(commentTable);
        $(commentTable).find('a:first').after('<a id="filterUserName">+</a>'); // Add link for filter
        $(commentTable).find('#filterUserName').click(function() {
            iterateComments(!otherCommentsHidden, username);
        });
    });

});