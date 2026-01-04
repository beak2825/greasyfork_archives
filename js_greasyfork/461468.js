// ==UserScript==
// @name          Minimizar a barra lateral do YouTube figuccio
// @description   Minimiza automaticamente a barra lateral do YouTube 2023
// @namespace     https://greasyfork.org/users/237458
// @grant         GM_setValue
// @grant         GM_getValue
// @version       0.4
// @author        figuccio
// @match         https://*.youtube.com/*
// @icon          https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @license       MIT
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/461468/Minimizar%20a%20barra%20lateral%20do%20YouTube%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/461468/Minimizar%20a%20barra%20lateral%20do%20YouTube%20figuccio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function minimizeSidebarIfOpened() {
        var guide = document.getElementById('guide');
        var menuButton = document.querySelector('#guide-icon.ytd-masthead');
        if (guide && guide.getAttribute('opened') !== null && menuButton) {
            menuButton.click();
        }
    }

    var intervalId = setInterval(minimizeSidebarIfOpened, 2000);

    // Cancella l'intervallo quando non è più necessario
    function clearIntervalIfSidebarClosed() {
        var guide = document.getElementById('guide');
        var menuButton = document.querySelector('#guide-icon.ytd-masthead');
        if ((!guide || guide.getAttribute('opened') === null) && menuButton) {
            clearInterval(intervalId);
        }
    }

    // Controlla se è necessario cancellare l'intervallo ogni 5 secondi
    setInterval(clearIntervalIfSidebarClosed, 5000);
})();
