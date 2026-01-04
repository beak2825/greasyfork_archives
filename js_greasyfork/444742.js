// ==UserScript==
// @name         Facebook cambia colore barra new facebook
// @author       figuccio
// @namespace    https://greasyfork.org/users/237458
// @description  color picker barra facebook
// @match        https://*.facebook.com/*
// @version      13.7
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @noframes
// @icon         https://facebook.com/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444742/Facebook%20cambia%20colore%20barra%20new%20facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/444742/Facebook%20cambia%20colore%20barra%20new%20facebook.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const $ = window.jQuery;
    const userdata = {color:'figuccio'};

    // Funzione per rendere l'elemento trascinabile con limiti di schermo
    function makeDraggableLimited(element) {
        element.draggable({
            containment: "window",
            stop: function(event, ui) {
                GM_setValue('boxPosition', JSON.stringify(ui.position));
            }
        });
    }

    // Funzione per salvare le impostazioni del colore e applicarlo immediatamente
    function saveColorSetting(color) {
        GM_setValue(userdata.color, color);
        $('div[aria-label="Facebook"][role="navigation"]').css("background-color", color);
    }

    $(document).ready(function() {
        const body = document.body;
        var mycolor = GM_getValue(userdata.color, "#980000"); // Valore predefinito (marzo 2025)
        let currentColor = mycolor;

        const box = $('<div id="my100">').css({
            position: 'fixed',
            top: '60px',
            left: '1000px',
            zIndex: 99999
        }).appendTo(body);

        // Ripristina la posizione salvata se presente
        const savedPosition = GM_getValue('boxPosition');
        if (savedPosition) {
            box.css(JSON.parse(savedPosition));
        }

        makeDraggableLimited(box);

        // Mostra/Nascondi dal menu
        function toggleBox() {
            box.toggle();
        }
        GM_registerMenuCommand("Nascondi/Mostra box", toggleBox);

        // Stili CSS
        GM_addStyle(`
            #colorspan { margin-left: 1px; margin-bottom: -19px; color: lime; background-color: brown; border: 1px solid blue; border-radius: 5px; }
            #setui { width: auto; height: 25px; margin-top: -1px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px; border-width: 1px; color: lime; }
            #colorinput {height:25px;width:50px; margin-left: 4px; margin-top: 4px; background-color: #3b3b3b; color: red; border: 2px solid green; border-radius: 5px; }
           #datePicker{border:1px solid yellow;border-radius:5px;cursor:pointer;text-align:center;margin-top:-6px;margin-left:30px;font-size:14px;width:max-content;}
            .button { padding: 2px 2px; margin-top: -19px; display: inline-block; border: 1px solid green; border-radius: 3px; cursor: pointer; background: red; }
        `);

 let use12HourFormat = GM_getValue('use12HourFormat', false); // Default è il formato 24 ore
let language = GM_getValue('language') || 'it'; // Recupera la lingua dal localStorage o usa 'it' come predefinita

const languages = {
    en: { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' },
    it: { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' }
};

        // Funzione per aggiornare l'ora
    function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const date = now.toLocaleString(language, languages[language]); // Usa la lingua selezionata per la data
    let period = "";

    if (use12HourFormat) { // Condizione corretta per il formato 12 ore
        period = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12; // Converte in formato 12 ore
    }

    hours = String(hours).padStart(2, "0"); // Aggiunge lo zero iniziale per ore
   document.getElementById("datePicker").textContent = `${date} ${hours}:${minutes}:${seconds}:${milliseconds}${period}`;
        }

    function changeLanguage() {
    language = (language === 'it') ? 'en' : 'it'; // Alterna tra 'it' e 'en'
    GM_setValue('language', language); // Salva la lingua scelta
}

    function toggleFormat() {
    use12HourFormat = !use12HourFormat; // Alterna il formato orario
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
}
// Registra i menu di comando
GM_registerMenuCommand("Cambia lingua datario", changeLanguage);
GM_registerMenuCommand("Cambia formato orario 12/24", toggleFormat);
// Chiama la funzione di inizializzazione e avvia il timer
const intervalTime = 90; // Imposta l'intervallo di tempo
setInterval(updateClock, intervalTime);
        // Contenuto del box
        box.html(`
            <fieldset style="background:blue; border: 2px solid red; color: lime; border-radius: 7px; text-align: center; width:250px;">
                <div id="datePicker"  title="Data-ora" ></div>
                       <legend>Time</legend>
     <div>
     <label style="color:lime;">
                            <input type="radio" name="options" title="cambia lingua data" value="changeLanguage" style="cursor:pointer;">Lingua
                        </label>
                        <label style="color:lime;">
                        <input type="radio" name="options" title="cambia 12/24h" value="toggleFormat" style="cursor:pointer;">12/24h
                        </label>
                <div id="setui">
                   <button id="colorspan"title="Hex value">${currentColor}</button><input type="color" list="colors" id="colorinput" value="${currentColor}" title="color picker">
                </div>
            </fieldset>
        `);
// Event listener for radio button selection
$('input[name="options"]').on('change', function() {
    const selectedValue = $(this).val();
    if (selectedValue === 'changeLanguage') {
        changeLanguage();
    } else if (selectedValue === 'toggleFormat') {
        toggleFormat();
    }

    // Disable the radio buttons temporarily
    $('input[name="options"]').prop('disabled', true);

    // Re-enable the radio buttons after a short delay
    setTimeout(() => {
        $('input[name="options"]').prop('disabled', false).prop('checked', false);
    }, 300); // Milliseconds
});

        const colorInput = $('#colorinput');
        const colorSpan = $('#colorspan');

        // Evento cambio colore
        colorInput.on('input', function(event) {
            currentColor = event.target.value;
            colorSpan.text(currentColor);
            saveColorSetting(currentColor); // Applica immediatamente il colore
        });

        // Inizializza i valori
        colorSpan.text(currentColor);
        colorInput.val(currentColor);

        // Applica il colore iniziale
        saveColorSetting(currentColor);
    });
})();
