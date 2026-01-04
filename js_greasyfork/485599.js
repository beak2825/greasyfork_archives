// ==UserScript==
// @name         TORN - XP Race value setter
// @namespace    http://tampermonkey.net/
// @version      2024-01-24
// @description  for lazy racers
// @author       Homki [2617846]
// @match        https://www.torn.com/loader.php?sid=racing*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485599/TORN%20-%20XP%20Race%20value%20setter.user.js
// @updateURL https://update.greasyfork.org/scripts/485599/TORN%20-%20XP%20Race%20value%20setter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const linksList = document.getElementById("top-page-links-list");
    const docksButton = document.createElement('button');
    const speedButton = document.createElement('button');

    docksButton.textContent = 'DocksXP-race';
    docksButton.name = 'Docks-button';
    docksButton.classList.add("t-clear", "h", "c-pointer", "line-h24", "right")
    docksButton.addEventListener('click', function (){
        document.getElementsByName("laps")[0].value = 100
        document.getElementsByName("maxDrivers")[0].value = 2
        document.getElementById('select-racing-track').value = 10
        document.getElementById('racename').value = 'Docks- XP race'
        document.getElementById("select-racing-track-button").children[0].innerText = 'Docks'
    });

    speedButton.textContent = 'SpeedwayXP-race';
    speedButton.name = 'Speed-button';
    speedButton.classList.add("t-clear", "h", "c-pointer", "line-h24", "right")
    speedButton.addEventListener('click', function () {
        document.getElementsByName("laps")[0].value = 100
        document.getElementsByName("maxDrivers")[0].value = 2
        document.getElementById('select-racing-track').value = 21
        document.getElementById('racename').value = 'Speedway- XP race'
        document.getElementById("select-racing-track-button").children[0].innerText = 'Speedway'
    });

    linksList.appendChild(docksButton);
    linksList.appendChild(speedButton);

})();