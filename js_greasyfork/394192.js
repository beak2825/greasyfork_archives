// ==UserScript==
// @name            millesimisec Clock figuccio
// @description     Clock millisecondi con salvataggio posizione
// @match           *://*/*
// @version         9.7
// @author          figuccio
// @noframes
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @namespace       https://greasyfork.org/users/237458
// @require         http://code.jquery.com/jquery-latest.js
// @require         https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon            data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/394192/millesimisec%20Clock%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/394192/millesimisec%20Clock%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
var $ = window.jQuery.noConflict();
const body = document.body;
var box = document.createElement("div");
box.id = "milli";
box.title = 'trascina time';
box.setAttribute("style", "background:blue;color:red;cursor:move;font-family:sans-serif;width:290px;font-size:16px;top:0px;line-height:21px;position:fixed;text-align:center;z-index:999999;");

// Recupera le coordinate salvate
var savedPosition = GM_getValue("widget_position");
if (savedPosition) {
    var [left, top] = savedPosition.split(",");
    box.style.left = left + "px";
    box.style.top = top + "px";
}

document.body.appendChild(box);
    $(box).draggable({
    containment: "window", // Assicura che l'elemento draggable sia confinato alla finestra del browser
    stop: function() {
        // Salva le nuove coordinate quando si smette di trascinare il widget
        var position = $(this).position();
        GM_setValue("widget_position", position.left + "," + position.top);
    }
});
let use12HourFormat = GM_getValue('use12HourFormat', true); // Default è il formato 24 ore   false 12 ore
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
    document.getElementById("milli").textContent = `${hours}:${minutes}:${seconds}:${milliseconds}${period} ${date}`;
}

tick();
setInterval(tick, 70);
function changeLanguage() {
    language = (language === 'it') ? 'en' : 'it';
    GM_setValue('language', language); // Salva la lingua scelta nel localStorage
}
function toggleFormat() {
    //Cambia il formato orario
    use12HourFormat = !use12HourFormat;
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
}
GM_registerMenuCommand("Cambia formato orario 12/24", toggleFormat);
GM_registerMenuCommand("Cambia lingua datario", changeLanguage);
//mostra nascondi time
function myFunction2() {
    box.style.display = ((box.style.display!='none') ? 'none' : 'block');
}
GM_registerMenuCommand("mostra/nascondi", myFunction2);
})();
