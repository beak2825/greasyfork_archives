// ==UserScript==
// @name        Clock2
// @description Show time drag
// @author      figuccio
// @version     0.8
// @namespace   https://greasyfork.org/users/237458
// @match       *://*/*
// @noframes
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon        https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/381457/Clock2.user.js
// @updateURL https://update.greasyfork.org/scripts/381457/Clock2.meta.js
// ==/UserScript==
(function() {
 'use strict';
const $ = window.jQuery.noConflict();
const body=document.body;

var todVisible = true; // Variabile per monitorare se l'orologio è visibile o meno
// Funzione per salvare la posizione dell'orologio nella memoria locale
function saveClockPosition(x, y) {
GM_setValue('clockPosition', JSON.stringify({ x: x, y: y }));
}

// Funzione per caricare la posizione dell'orologio dalla memoria locale
function loadClockPosition() {
    const savedPosition = GM_getValue('clockPosition');
    if (savedPosition) {
        const position = JSON.parse(savedPosition);
        tod.style.left = position.x + 'px';
        tod.style.top = position.y + 'px';
    }
}

var tod = document.createElement("div");
tod.id = "todClock";

tod.setAttribute("style", `
    top: 0;
    color: black;
    font-family: "Droid Sans Mono";
    font-size: 16pt;
    line-height: 20px;
    position: fixed;
    text-align: center;
    z-index: 99999999999;
    background-color: green;
    -moz-user-select: none;
    cursor: move;
`);
let use12HourFormat = GM_getValue('use12HourFormat', false); // Default è il formato 24 ore
let language = GM_getValue('language') || 'it'; // Recupera la lingua dal localStorage o usa 'it' come predefinita

const languages = {
    en: { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' },
    it: { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' }
};

function tick() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const date = now.toLocaleString(language, languages[language]); // Usa la lingua selezionata per la data

    let period = "";

    if (!use12HourFormat) {
        period = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12; // Converte in formato 12 ore
    }

    hours = String(hours).padStart(2, "0");
    tod.textContent =`${date} ${hours}:${minutes}:${seconds}:${milliseconds}${period}`;
}
function toggleLanguage() {
    language = language === 'it' ? 'en' : 'it'; // Cambia solo la lingua
    GM_setValue('language', language); // Salva la lingua scelta
    tick(); // Aggiorna immediatamente la visualizzazione
}
function toggleFormat() {
    //Cambia il formato orario
    use12HourFormat = !use12HourFormat;
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
}
 // Menu commands
    GM_registerMenuCommand('Mostra/Nascondi orologio', function() {
        todVisible = !todVisible;
        $(tod).toggle(todVisible);
    });
GM_registerMenuCommand("Cambia formato orario 12/24", toggleFormat);
GM_registerMenuCommand("Cambia lingua", toggleLanguage);
$(tod).draggable({
    containment: "window", // Assicura che l'elemento draggable sia confinato alla finestra del browser
    stop: function(event, ui) {
    saveClockPosition(ui.position.left, ui.position.top);
    }
});

body.append(tod);

loadClockPosition(); // Carica la posizione dell'orologio dalla memoria locale
tick();
setInterval(tick, 70);

})();
