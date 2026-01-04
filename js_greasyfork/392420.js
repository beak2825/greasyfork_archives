// ==UserScript==
// @name           To Top Buttonfiguccio
// @author         figuccio
// @namespace      https://greasyfork.org/users/237458
// @description    Aggiunge un pulsante per tornare all'inizio delle pagine.
// @version        0.4
// @match          *://*/*
// @noframes
// @grant          GM_addStyle
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/392420/To%20Top%20Buttonfiguccio.user.js
// @updateURL https://update.greasyfork.org/scripts/392420/To%20Top%20Buttonfiguccio.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var toTopButton = document.createElement('div');
    toTopButton.innerHTML = '<button id="toTopButton" type="button" title="Torna su">🡹</button>';
    toTopButton.setAttribute('id', 'toTopContainer');
    document.body.appendChild(toTopButton);

    // Attiva il pulsante appena aggiunto.
    document.getElementById("toTopButton").addEventListener("click", function() {
        window.scrollTo(0, 0);
    });

    // Stile del pulsante.
    GM_addStyle(`
        #toTopButton {
            position: fixed;
            bottom: 2px;
            right: 170px;
            text-align: left;
            font-size: 11pt;
            font-weight: bold;
            cursor: pointer;
            color: red !important;
            background-color: yellow;
            border: 2px solid black;
            border-radius: 12px;
            padding: 6px 15px;
            z-index: 99999;
            text-decoration: none;
        }
    `);

    // Mostra o nasconde il pulsante in base alla posizione dello scroll.
    function toggleButtonVisibility() {
        var button = document.getElementById("toTopContainer");
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    }

    // Aggiorna la visibilità del pulsante all'avvio e ad ogni scroll.
    window.addEventListener('load', toggleButtonVisibility);
    window.addEventListener('scroll', toggleButtonVisibility);
})();
