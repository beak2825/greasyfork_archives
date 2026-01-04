// ==UserScript==
// @name         Travian Troops autofill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send attacks based on a template
// @author       You
// @match        https://*.travian.com/build.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421338/Travian%20Troops%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/421338/Travian%20Troops%20autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var TROOP_KEY = 'at';
    var NUM_TROOP_TYPES = 11;

    var storedTroops = localStorage.getItem(TROOP_KEY);
    var troops = [[19,0,0,0,0,0,0,1,0,0,0],[19,0,0,0,0,0,0,1,0,0,0]];

    if (storedTroops) {
        troops = JSON.parse(storedTroops);
    }

    function setAutofill() {
        var padding = NUM_TROOP_TYPES - $($('.units').find('tr:nth(1)')[0]).find('td').length;
        var newTroops = [];
        $('.units').find('tr:nth(1)').each(function(i, el) {
            var newWave = [];
            $(el).find('td').each(function(j, trp) {
                newWave.push($(trp).html());
            })
            newTroops.push(newWave);
        });
        localStorage.setItem(TROOP_KEY, JSON.stringify(newTroops));
        console.log("successfully saved autofill: " + newTroops);
    }

    troops.forEach(function(trps, wave) {
        trps.forEach(function(trp, i) {
                $('[name="troops[' + wave + '][t'+ (i + 1) + ']"]').val(trp);
        })
    })

    $('[name="c"][value=3]').click();

    if ($('#troops').length === 0) {
        $('#rallyPointButtonsContainer').prepend('<input type="button" value="Save as autofill" id="safill" style="border: 1px solid #333; line-height: 20pt" />')

        $('#safill').on('click', setAutofill);
    }
})();