// ==UserScript==
// @name         igloo fuckers
// @version      0.2.0
// @description  igloo fuckers.
// @author       j0hnZen
// @match        https://www.torn.com/factions.php?step=profile&ID=14821*

// @grant        none
// @namespace    j0hnZen
// @downloadURL https://update.greasyfork.org/scripts/396469/igloo%20fuckers.user.js
// @updateURL https://update.greasyfork.org/scripts/396469/igloo%20fuckers.meta.js
// ==/UserScript==

// check that script is run on right page

$(window).on("load", function() {

    $( ".cont-gray10.bottom-round.cont-toggle.faction-description.text-a-center" ).find("p").remove();

    $('[id=icon2]').parent().parent().parent().remove();
    $('[class=t-red]').parent().parent().parent().parent().remove();

});