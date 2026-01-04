// ==UserScript==
// @name         Scryfall 5 cards per line
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scryfall 5 cards per line instead of 4
// @author       Aviem Zur
// @match        https://scryfall.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464249/Scryfall%205%20cards%20per%20line.user.js
// @updateURL https://update.greasyfork.org/scripts/464249/Scryfall%205%20cards%20per%20line.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var divs = document.getElementsByClassName('card-grid-item');
    for (var i=0; i < divs.length; i++) {
        divs[i].style['width'] = '19.5%'
    }
})();