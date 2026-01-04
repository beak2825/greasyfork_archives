// ==UserScript==
// @name         Bitchute Channel Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the given list of channels from the user page
// @author       MeyimAgalot
// @match        https://www.bitchute.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396555/Bitchute%20Channel%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/396555/Bitchute%20Channel%20Remover.meta.js
// ==/UserScript==

// Blocked channels are not bad, just used as an example
// (except Geeks + Gamers who are very censor-happy, so feel free to censor them too :)

(function() {
    'use strict';

    var aTags=document.getElementsByTagName('a');
    var arr_remove = ["Geeks + Gamers", "tv almassora", "Kanal für Wahnsinnige im Endstadium"];

    for (var i = 0; i < aTags.length; i++) {
        if (arr_remove.includes(aTags[i].textContent)) {
            var Atag=aTags[i].closest('div.text-center');
            Atag.remove();

        }
    }

})();