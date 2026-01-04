// ==UserScript==
// @name         Faction Travel stock notify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  allows alerting faction to stock of items abroad
// @author       Rescender[2526540]
// @match        https://www.torn.com/index.php
// @downloadURL https://update.greasyfork.org/scripts/403458/Faction%20Travel%20stock%20notify.user.js
// @updateURL https://update.greasyfork.org/scripts/403458/Faction%20Travel%20stock%20notify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sendNotify = function(e) {
        var parentLi = $(e.target).parents('li');

        if ($('div[title=Faction]').parent().parent().height() < 50) {
          $('div[title=Faction]').click();
        }

        var name = parentLi.find(".name").contents()[2].data.trim() || "testname";
        var cost = parentLi.find(".c-price").text().trim() || "testcost";
        var stock = parentLi.find(".stck-amount").text().trim() || "teststock";
        var exists = $('div[class*=faction_] textarea').val() || "";
        var country = exists ? "" : $('#skip-to-content').text().trim() + "\n";
        var newValue = exists + country + name + "("+cost+"): "+ stock + " in stock!\n";
        console.log(newValue);
        $('div[class*=faction_] textarea').val(newValue);
    }

    $('.users-list li .name').each(function( index ) {
        $(this).append('<button class="notify-button">Notify</button>');
    });

    $(document).on('click', '.notify-button', sendNotify);

})();