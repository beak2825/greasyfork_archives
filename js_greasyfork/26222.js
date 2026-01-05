// ==UserScript==
// @name         Neopets Buried Treasure - Random Ticket Button
// @namespace    shiftasterisk
// @version      0.1
// @description  Adds button to pick random ticket on buried treasure page
// @author       shiftasterisk
// @match        http://www.neopets.com/pirates/buriedtreasure/buriedtreasure.phtml
// @include      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26222/Neopets%20Buried%20Treasure%20-%20Random%20Ticket%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/26222/Neopets%20Buried%20Treasure%20-%20Random%20Ticket%20Button.meta.js
// ==/UserScript==
if ($('b:contains("Sorry, you have to wait")').length == 0) {
    $('input[type="submit"][value="Back to Krawk Island"]').parent().append("<input id='pickRandom' type='button' value='Pick Random Ticket'>");

    $('#pickRandom').css({
        'margin-left': '20px'
    });

    $('#pickRandom').click(function() {
        window.location = "http://www.neopets.com/pirates/buriedtreasure/buriedtreasure.phtml?" + (Math.round(Math.random() * 449) + 26) + "," + (Math.round(Math.random() * 454) + 31);
    });
}