// ==UserScript==
// @name          fokse's Ai Filter for krisman101
// @author        Fokse
// @description   Remove Undesired game
// @namespace     BNPAiFilter
// @include https://forums.d2jsp.org/forum.php?f=104
// @include https://forums.d2jsp.org/forum.php?f=104&o=*
// @require https://code.jquery.com/jquery-latest.js
// @version 1.00

// @downloadURL https://update.greasyfork.org/scripts/373720/fokse%27s%20Ai%20Filter%20for%20krisman101.user.js
// @updateURL https://update.greasyfork.org/scripts/373720/fokse%27s%20Ai%20Filter%20for%20krisman101.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if (window.location.href.match(/\/forum\.php\?f\=104/)) {

        $('body dl dd table.ftb tbody tr').each(function() {

            var topic = {
                name: null
            }
            if ($("td:nth-child(2) > a", this).length == 1 && typeof $("td:nth-child(2) > a", this).attr('href')) {
                topic.name = $("td:nth-child(2) > a", this).text();
            } else {
                if (typeof $("td:nth-child(2) > a:nth-child(2)", this).attr('href') !== 'undefined') {
                    topic.name = $("td:nth-child(2) > a:nth-child(2)", this).text()
                }
            }
            var resultat = /([Loser|Winn?er] ?(w|W)in|High Roll|Rr|Hr|Lw|A\/?i(?!\S)?|W\/?w(?!\S)|L\/w(?!\S)|All(\-| )?(i|I)n)/.exec(topic.name)
            if (resultat) {
                this.remove();
            }
        });
    }

})();