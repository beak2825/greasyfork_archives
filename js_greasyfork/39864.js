// ==UserScript==
// @name         Polarity banner 4s
// @version      1.0
// @description  Hangry Hippo
// @author       lefty (I stole this all from Zile tho)
// @icon         https://i.imgur.com/C72wVr7.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @namespace https://greasyfork.org/users/175033
// @downloadURL https://update.greasyfork.org/scripts/39864/Polarity%20banner%204s.user.js
// @updateURL https://update.greasyfork.org/scripts/39864/Polarity%20banner%204s.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ($("div:contains(Pick the reputation polarity )").length){
    $('input[name=sentiment]').eq(0).click();


    setTimeout(function(){
        $('input[type=submit]').click();
    },10000);
    }
});