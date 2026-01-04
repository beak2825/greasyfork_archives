// ==UserScript==
// @name          colore barra facebook ramdom figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       1.2
// @author        figuccio
// @description   cambia  colori random
// @match         https://*.facebook.com/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @run-at        document start
// @icon          https://facebook.com/favicon.ico
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license        MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/429661/colore%20barra%20facebook%20ramdom%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/429661/colore%20barra%20facebook%20ramdom%20figuccio.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Crea button element
    const button = document.createElement('button');
    button.id = 'prova';
    button.title = 'Cambio Colore';
    button.className = 'test';
    button.style.cssText = "position:absolute;top:370px;right:0;z-index:9999;background-color:yellow;color:black;padding:5px;border-radius:5px;border:1px solid green;";
    button.innerHTML = 'Cambia colore FB random';

    // Aggiungi il pulsante al corpo
    document.body.appendChild(button);

    // Definisci la matrice dei colori
    const colors = ["blue", "salmon", "green", "violet", "red", "orange", "purple", "pink", "yellow", "cyan", "#0099cc", "#587b2e", "#990000", "#000000", "#1C8200", "#987baa", "#981890", "#AA8971", "#1987FC", "#99081E"];
    let index = 0;

    // Allega l'evento clic al pulsante
    var $ = window.jQuery;
    $(document).ready(function () {
        $('#prova').click(function () {
            // Seleziona un colore in modo casuale
            const selectedColor = colors[index];
            // Applica il colore selezionato agli elementi di Facebook
            $('body, #blueBarDOMInspector > div, #blueBarDOMInspector div[role="banner"], #fb2k_pagelet_bluebar > #blueBarDOMInspector > div > div, div[aria-label="Facebook"][role="navigation"]').css("background", selectedColor);

            // Aggiorna l'aspetto del pulsante
            button.innerHTML = `&nbsp;Cambio colore <br/>&nbsp;${selectedColor}`;
            button.style.backgroundColor = selectedColor;
            button.style.color = 'white';

            // Incrementa l'indice o azzera se alla fine dell'array
            index = index >= colors.length - 1 ? 0 : index + 1;

            // Salva il colore selezionato
            GM_setValue('lista', selectedColor);
        });
    });

    // Aggiungere il comando di menu per attivare/disattivare la visibilità del pulsante
    GM_registerMenuCommand("Mostra/Nascondi Pulsante", function () {
        button.style.display = button.style.display === 'none' ? 'block' : 'none';
    });

    // Ripristina il colore selezionato in precedenza
    if (GM_getValue('lista')) {
        const savedColor = GM_getValue('lista');
        $('body, #blueBarDOMInspector > div, #blueBarDOMInspector div[role="banner"], #fb2k_pagelet_bluebar > #blueBarDOMInspector > div > div, div[aria-label="Facebook"][role="navigation"]').css("background", savedColor);
        button.style.backgroundColor = savedColor;
        button.style.color = 'white';
    }
})();
