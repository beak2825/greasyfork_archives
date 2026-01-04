// ==UserScript==
// @name          Clock figuccio
// @description   Clock ore, minuti, secondi, millisecondi e data
// @version       2.9
// @match         *://*/*
// @noframes
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @icon          data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @namespace     https://greasyfork.org/users/237458
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/376348/Clock%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/376348/Clock%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
// Importa jQuery
var $ = window.jQuery.noConflict();
const body = document.body;

// ====== UTILITY ====== //
// Funzione per aggiornare l'orologio
function updateClock() {
    const data = new Date().toLocaleString('it', { day: '2-digit', year: 'numeric', month: 'long', weekday: 'long' });
    document.getElementById('Clocktest').innerHTML = data;
}

// Funzione per aggiornare l'ora con millisecondi
function updateTime() {
    const date = new Date();
    const milliseconds = date.getMilliseconds();
    const ore = date.toLocaleString('it', { hour: '2-digit', minute: 'numeric', second: 'numeric' });
    document.getElementById('TimeDisplay').innerHTML = `${ore}:${milliseconds}`;
}

// Alterna la visibilità dei nodi (orologio e tempo)
function toggleNodes() {
    if (clockNode.style.display === 'none') {
        clockNode.style.display = 'block';
        timeNode.style.display = 'none';
    } else {
        clockNode.style.display = 'none';
        timeNode.style.display = 'block';
    }
}

// ====== CREAZIONE NODI ====== //
// Crea il nodo per l'orologio
const clockNode = document.createElement('div');
clockNode.id = "Clocktest";
clockNode.title = 'Clicca per cambiare';
clockNode.setAttribute("style", "width:200px;cursor:move;padding:4px;background:black;color:lime;font-family:Orbitron;letter-spacing:2px;font-size:14px;position:fixed;text-align:center;z-index:999999;border-radius:10px;border:2px solid red;");
body.appendChild(clockNode);
$(clockNode).draggable();

// Crea il nodo per il tempo
const timeNode = document.createElement('div');
timeNode.id = "TimeDisplay";
timeNode.title = 'Trascina e clicca';
timeNode.setAttribute("style", "width:100px;cursor:move;padding:4px;background:black;color:lime;font-family:sans-serif;font-size:14px;position:fixed;text-align:center;z-index:999999;border-radius:10px;border:2px solid yellow;");
body.appendChild(timeNode);

    $(timeNode).draggable({
    containment: "parent" // Limita il trascinamento all'interno del suo elemento contenitore ore
});

 $(clockNode).draggable({
    containment: "parent" // Limita il trascinamento all'interno del suo elemento contenitore  data
});

// ====== GESTIONE EVENTI ====== //
// Imposta aggiornamento orologio e tempo
setInterval(updateClock, 1000);
setInterval(updateTime, 70);

// Inizializza alternanza nodi
timeNode.addEventListener("click", toggleNodes);
clockNode.addEventListener("click", toggleNodes);

// Nascondi inizialmente il nodo orologio
clockNode.style.display = 'none';

// ====== SALVATAGGIO POSIZIONE ====== //
// Salva posizione nodi quando vengono trascinati
$(clockNode).on("dragstop", function (event, ui) {
    GM_setValue('clock_position', { x: ui.position.left, y: ui.position.top });
});

$(timeNode).on("dragstop", function (event, ui) {
    GM_setValue('time_position', { x: ui.position.left, y: ui.position.top });
});

// Ripristina la posizione dei nodi salvata
const clockPosition = GM_getValue('clock_position', { x: 0, y: 0 });
const timePosition = GM_getValue('time_position', { x: 0, y: 0 });
$(clockNode).css({ left: clockPosition.x, top: clockPosition.y });
$(timeNode).css({ left: timePosition.x, top: timePosition.y });
})();
