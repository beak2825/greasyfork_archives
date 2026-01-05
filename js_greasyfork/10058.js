// ==UserScript==
// @name           Secret Cinema Enhancer
// @namespace      surrealmoviez.info
// @description    Display changes for Secret Cinema
// @include        http://www.secret-cinema.net/viewtopic.php?id=*
// @require        http://code.jquery.com/jquery-1.11.1.min.js
// @grant          none
// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/10058/Secret%20Cinema%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/10058/Secret%20Cinema%20Enhancer.meta.js
// ==/UserScript==

$(document).ready(function () {
    if ($('.firstpost .postmsg .dt_pl').length === 2) {
        var description = $('.firstpost .postmsg').html();
        var pattern = /(tt\d+)/gi;
        var found = description.match(pattern);

        if (found.length > 0) {
            var uniqueIds = [];
            $.each(found, function (i, el) {
                if ($.inArray(el, uniqueIds) === -1)
                    uniqueIds.push(el);
            });

            var imdbIdRowContent = "";
            for (var i = 0; i < uniqueIds.length; i++) {
                imdbIdRowContent += '<a href="http://anonym.to/?http://www.imdb.com/title/' + uniqueIds[i] + '/" target="_blank">' + uniqueIds[i] + '</a> ';
            }
        }

        $('.firstpost .postmsg').prepend('<blockquote>' + imdbIdRowContent + '</blockquote>');
    }
});

