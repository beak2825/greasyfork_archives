// ==UserScript==
// @name         DC - TeamHealing Fixed
// @namespace    
// @version      1
// @description  Corrige l'impossibilité de soigner en combat lorsqu'un copain vous rejoint
// @author       Lorkah
// @match        https://www.dreadcast.net/Main
// @grant        none
// @license DON'T BE A DICK PUBLIC LICENSE ; https://dbad-license.org/
// @downloadURL https://update.greasyfork.org/scripts/419902/DC%20-%20TeamHealing%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/419902/DC%20-%20TeamHealing%20Fixed.meta.js
// ==/UserScript==

Combat.prototype.ajouteCombattant = function(e) {
    this.mon_equipe == $(e).attr("equipe") ? $("#combat_mon_equipe_joueurs").append($(e).xml()) : $("#combat_autre_equipe_joueurs").append($(e).xml()), this.activateFighter("#combattant_" + $(e).attr("id")), engine.activeLinkBox("#combattant_" + $(e).attr("id")), 6 <= $("#combat_mon_equipe_joueurs .combat_joueur").length && $("#combattant_sup").hide()
};