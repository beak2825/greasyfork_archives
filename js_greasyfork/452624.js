// ==UserScript==
// @name          new picker barra Facebook figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       1.6
// @author        figuccio
// @description   color picker all'interno della barra di Facebook
// @match         https://*.facebook.com/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at        document-start
// @icon          https://facebook.com/favicon.ico
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @noframes
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/452624/new%20picker%20barra%20Facebook%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/452624/new%20picker%20barra%20Facebook%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;
    $(document).ready(function() {
        var body = document.getElementsByTagName("body")[0];
        var container = document.createElement("div");
        body.append(container);
        container.innerHTML = `
            <input type="button" id="colorspan" title="Hex color" value="${myColor}"> Color<input type="color" list="colors" id="colorinput" value="${myColor}" title="Color picker">
        `;

GM_addStyle(`
    #colorspan {
        z-index: 999999999999;
        position: fixed;
        top: 11px;
        right: 300px;
        color: darkred;
        border: 1px solid green; /* Bordo più sottile */
        border-radius: 4px; /* Raggio minore */
        cursor: pointer;
        font-size: 12px; /* Dimensione testo ridotta */
        padding: 3px 4px; /* Riduzione margini interni */
    }
    #colorinput {
        z-index: 999999999999;
        position: fixed;
        top: 10px;
        right: 249px;
        border: 1px solid yellow; /* Bordo più sottile */
        border-radius: 4px; /* Raggio minore */
        cursor: pointer;
        width: 50px; /* Larghezza ridotta */
        height: 25px; /* Altezza ridotta */
    }
`);
        // User data for persistence
        const userData = { color: 'figuccio' };
        var myColor = GM_getValue(userData.color, "#980000"); // Valore predefinito   (marzo 2025)

        // Save custom data
        function saveSetting() {
            GM_setValue(userData.color, myColor);
            $('div[role="banner"]+div div[role="navigation"], div[role="complementary"], div[aria-label="Facebook"][role="navigation"]').css("background-color", myColor);
        }
 // Funzione per osservare i cambiamenti nel DOM
    function observeDOMChanges() {
    // Creazione di un observer con una funzione di callback
    var observer = new MutationObserver(function(mutationsList, observer) {
        // Per ogni mutazione rilevata, esegui la funzione saveSetting
        for(var mutation of mutationsList) {
            saveSetting();
        }
    });

    // Configurazione dell'observer per osservare cambiamenti nei nodi figlio e nei nodi attributo
    var config = {childList:true, attributes:true, subtree:true};
    // Inizia ad osservare il DOM target
    observer.observe(document.body, config);
}
// Avvia l'osservazione dei cambiamenti nel DOM
observeDOMChanges();

        var colorInput = document.querySelector('#colorinput');
        var colorSpan = document.querySelector('#colorspan');

        // Color picker event
        colorInput.addEventListener('input', function(event) {
            colorChange(event);
        }, false);

        $('div[role="banner"]+div div[role="navigation"], div[role="complementary"], div[aria-label="Facebook"][role="navigation"]').css("background-color", myColor);

        // Color change function
        function colorChange(e) {
            myColor = e.target.value;
            colorSpan.value = e.target.value;

            // Update color immediately visible
            $('div[role="banner"]+div div[role="navigation"], div[role="complementary"], div[aria-label="Facebook"][role="navigation"]').css("background-color", myColor);
            GM_setValue(userData.color, myColor);
        }

        colorSpan.value = myColor;
        colorInput.value = myColor;


    });
})();
