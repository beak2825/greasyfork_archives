// ==UserScript==
// @name         DS time left for ressources
// @version      0.6
// @description  Shows the time left to get the ressources for the building
// @author       Me
// @include      https://de*.die-staemme.de/game.php?village=*&screen=main
// @include      https://de*.die-staemme.de/game.php?village=*&screen=snob
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @namespace    https://greasyfork.org/users/264735
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/379905/DS%20time%20left%20for%20ressources.user.js
// @updateURL https://update.greasyfork.org/scripts/379905/DS%20time%20left%20for%20ressources.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var woodIs = $('#wood')[0].textContent;
    var stoneIs = $('#stone')[0].textContent;
    var ironIs = $('#iron')[0].textContent;

    var woodProduction = $('#wood').attr("title").split(" ")[2];
    var stoneProduction = $('#stone').attr("title").split(" ")[2];
    var ironProduction = $('#iron').attr("title").split(" ")[2];

    $('.warn').each(function (){
        var timeLeft = 0;
        if (this.classList.contains('cost_wood') || this.id == 'next_snob_cost_wood' || this.id == 'coin_cost_wood')
        {
            timeLeft = (this.textContent.replace('.', '') - woodIs) / woodProduction;
        }
        else if (this.classList.contains('cost_stone') || this.id == 'next_snob_cost_stone' || this.id == 'coin_cost_stone')
        {
            timeLeft = (this.textContent.replace('.', '') - stoneIs) / stoneProduction;
        }
        else if (this.classList.contains('cost_iron') || this.id == 'next_snob_cost_iron' || this.id == 'coin_cost_iron')
        {
            timeLeft = (this.textContent.replace('.', '') - ironIs) / ironProduction;
        }
        else
        {
            return;
        }

        var hours = Math.floor(timeLeft);
        var minutes = Math.round((timeLeft - hours) * 60);
      
      console.log(hours + ":" + minutes);

        this.append(" (" + hours + ":" + (("0" + minutes).slice(-2)) + ")");
    });
})();