// ==UserScript==
// @name         Both Polarity Banner Scripts
// @version      1.1
// @description  Raining Pennies
// @author       ZileWrath + Lefty + Eisenpower
// @icon         https://i.imgur.com/C72wVr7.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @namespace    https://greasyfork.org/users/175033
// @downloadURL https://update.greasyfork.org/scripts/39924/Both%20Polarity%20Banner%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/39924/Both%20Polarity%20Banner%20Scripts.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ($("strong:contains(Article Clip Reputation Polarity Instructions)").length) {
        $('[value="Neutral"]').click();
        setTimeout(function() {
            $('input[type=submit]').click();
        }, 10000);
    }

    else if ($("strong:contains(Tweet Reputation Polarity Instructions)").length) {
        $('[value="Positive"]').click();
        setTimeout(function() {
            $('input[type=submit]').click();
        }, 10000);
    }
});