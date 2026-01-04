// ==UserScript==
// @name            Clock   h m s ms
// @description     clock ore minuti secondi millesimi
// @version         0.7
// @match           *://*/*
// @noframes
// @author          figuccio
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @icon            data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @namespace       https://greasyfork.org/users/237458
// @require         http://code.jquery.com/jquery-latest.js
// @require         https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/405637/Clock%20%20%20h%20m%20s%20ms.user.js
// @updateURL https://update.greasyfork.org/scripts/405637/Clock%20%20%20h%20m%20s%20ms.meta.js
// ==/UserScript==
(function() {
    'use strict';
const $ = window.jQuery, body = document.body, id = "clock";
const addZero = (x, n) => x.toString().padStart(n, "0");
let is24HourFormat = GM_getValue("is24HourFormat", true); // Impostazione iniziale: formato 24 ore

const updateClock = () => {
    let d = new Date();
    let hours = d.getHours();
    let ampm = "";
    if (!is24HourFormat) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Converti 24h in 12h
    }
    let h = addZero(hours, 2);
    let m = addZero(d.getMinutes(), 2);
    let s = addZero(d.getSeconds(), 2);
    let ms = addZero(d.getMilliseconds(), 3);
    document.getElementById(id).innerHTML = is24HourFormat
        ? `${h}:${m}:${s}:${ms}`
        : `${h}:${m}:${s}:${ms} ${ampm}`;
};

// Aggiungi il comando per cambiare formato orario
GM_registerMenuCommand("Cambia Formato Orario (12h/24h)", () => {
    is24HourFormat = !is24HourFormat; // Alterna tra 12 ore e 24 ore
    GM_setValue("is24HourFormat", is24HourFormat); // Salva la scelta
});

let clock = $(`<div id="${id}" title="trascina time" style="cursor:move;padding:4px;background:red;color:lime;top:0;font-family:sans-serif;font-size:14px;position:fixed;text-align:center;z-index:999999;border-radius:10px;border:2px solid blue;"></div>`)
    .appendTo(body)
    .draggable({
     containment: "window", // Impedisce di trascinarlo fuori dalla finestra del browser
     stop: (e, ui) => GM_setValue("clockPosition", `${ui.position.left},${ui.position.top}`)
    });
let savedPosition = GM_getValue("clockPosition")?.split(",");
if (savedPosition) clock.css({left: `${savedPosition[0]}px`, top: `${savedPosition[1]}px`});

setInterval(updateClock, 70);
////////////////////////////////
let defaultFontSize = GM_getValue("fontSize", "14px"); // Recupera la dimensione salvata o usa "14px" di default
// Applica la dimensione salvata al caricamento della pagina
clock.css("font-size", defaultFontSize);

GM_registerMenuCommand("Cambia Dimensione Testo", () => {
    let newSize = prompt("Inserisci la dimensione del testo (es: 14px, 20px):", defaultFontSize);
    if (newSize) {
        clock.css("font-size", newSize); // Applica la nuova dimensione
        GM_setValue("fontSize", newSize); // Salva la nuova dimensione
       // alert(`Dimensione del testo aggiornata a ${newSize}`);
    }
});

GM_registerMenuCommand("Mostra/Nascondi Orologio", () => {
    clock.toggle();
});
})();