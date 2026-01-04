// ==UserScript==
// @name            IGLO Progression chart mover
// @name:pl         IGLO Schowaj wykres siły
// @namespace       https://greasyfork.org/en/scripts/500468-iglo-progression-chart-mover
// @version         0.2
// @description     Move not-so-useful progression chart after the important games information.
// @description:pl  Przesuwa zbędny wykres siły na dół, poniżej informacji o grach.
// @author          Mariusz Klimczak
// @match           https://iglo.szalenisamuraje.org/players/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/500468/IGLO%20Progression%20chart%20mover.user.js
// @updateURL https://update.greasyfork.org/scripts/500468/IGLO%20Progression%20chart%20mover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = document.querySelector("div.container div.row div.col");
    const igor_chart = document.getElementById("igor_progress");

    container.append(igor_chart);
})();