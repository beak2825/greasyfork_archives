// ==UserScript==
// @name         OSRS Wiki redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects wikia links to the new official OSRS Wiki
// @author       /u/Vadehoc
// @include      /^https://www\.google\.[A-Za-z0-9]*//
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/373205/OSRS%20Wiki%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/373205/OSRS%20Wiki%20redirect.meta.js
// ==/UserScript==

var $ = window.jQuery;

$(document).ready(function(){
    $("a[href*='oldschoolrunescape.wikia.com']").each(function(){
        var obj = $(this);
        var url = obj.attr('href');
        var ping = obj.attr('ping');
        $(this).attr('href', url.replace('oldschoolrunescape.wikia.com/wiki', 'oldschool.runescape.wiki/w'));
        if(ping !== undefined)
        {
            $(this).attr('ping', ping.replace('oldschoolrunescape.wikia.com/wiki', 'oldschool.runescape.wiki/w'));
        }
    });
});