// ==UserScript==
// @name           clock barra Facebook
// @namespace      https://greasyfork.org/users/237458
// @description    Facebook clock
// @match          https://*.facebook.com/*
// @author         figuccio
// @version        1.1
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @noframes
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon           data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/401327/clock%20barra%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/401327/clock%20barra%20Facebook.meta.js
// ==/UserScript==
(function() {
    'use strict';
var $ = window.jQuery.noConflict();
const body = document.body;
const CLOCK_STORAGE_KEY = 'clock_position';

// Funzione per ottenere la posizione dell'orologio memorizzata
function getClockPosition() {
    return GM_getValue(CLOCK_STORAGE_KEY, {top: '0px', left: '0px'});
}

// Funzione per salvare la posizione dell'orologio
function saveClockPosition(position) {
    GM_setValue(CLOCK_STORAGE_KEY, position);
}

// Funzione per aggiornare la posizione dell'orologio
function updateClockPosition() {
    $(node).css(getClockPosition());
}

// Funzione per aggiornare la posizione dell'orologio quando viene trascinato
function onDragStop(event, ui) {
    const position = {
        top: ui.position.top + 'px',
        left: ui.position.left + 'px'
    };
    saveClockPosition(position);
}
let use12HourFormat = GM_getValue('use12HourFormat', false); // Default è il formato 24 ore
let language = GM_getValue('language') || 'it'; // Recupera la lingua dal localStorage o usa 'it' come predefinita

const languages = {
    en: { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' },
    it: { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' }
};
// Funzione per aggiornare l'ora dell'orologio
function clockTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    var date = new Date().toLocaleDateString(language, languages[language]); // Usa la lingua selezionata per la data
     let period = "";

    if (!use12HourFormat) {
        period = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12; // Converte in formato 12 ore
    }

    hours = String(hours).padStart(2, "0");
document.getElementById("Clocktest").textContent = `${hours}:${minutes}:${seconds}:${milliseconds}${period} ${date}`;
}
function changeLanguage() {
    language = (language === 'it') ? 'en' : 'it';
    GM_setValue('language', language); // Salva la lingua scelta nel localStorage
}
function toggleFormat() {
    //Cambia il formato orario
    use12HourFormat = !use12HourFormat;
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
}

// Crea il menu e inizializza il setInterval
GM_registerMenuCommand("Cambia lingua datario", changeLanguage);
GM_registerMenuCommand("Cambia formato orario 12/24", toggleFormat);
// Crea nodo orologio
var node = document.createElement('div');
node.id = "Clocktest";
node.title = 'Time';
node.setAttribute("style","cursor:move;padding:4px;background:black;width:300px;color:yellow;font-family:Orbitron;letter-spacing:2px;top:0;font-size:16px;position:fixed;text-align:center;z-index:999999;border-radius:10px;border:2px solid red;");
document.body.appendChild(node);

// Imposta la posizione dell'orologio e rendilo trascinabile
updateClockPosition();
$(node).draggable({
containment: "window", // Assicura che l'elemento draggable sia confinato alla finestra del browser
stop: onDragStop
});

// Aggiorna l'ora dell'orologio ogni 70 millisecondi
setInterval(clockTime, 70);

// Comando del menu Mostra/nascondi orologio
function toggleClockVisibility() {
node.style.display = ((node.style.display!='none') ? 'none' : 'block');
}

// Registra il comando del menu per mostrare/nascondere l'orologio
GM_registerMenuCommand("mostra clock/nascondi clock", toggleClockVisibility);
})();