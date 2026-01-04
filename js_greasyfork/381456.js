// ==UserScript==
// @name           Clock1
// @description    Clock in basso alle pagine colore blu e rosso
// @author         figuccio
// @version        1.0
// @match          *://*/*
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon           data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @license        MIT
// @namespace      https://greasyfork.org/users/237458
// @downloadURL https://update.greasyfork.org/scripts/381456/Clock1.user.js
// @updateURL https://update.greasyfork.org/scripts/381456/Clock1.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery.noConflict();
    // Funzione per salvare la posizione del div utilizzando GM_setValue
    function savePosition(top, left) {
        GM_setValue('clockPosition', JSON.stringify({top: top, left: left}));
    }

    // Funzione per caricare la posizione utilizzando GM_getValue
    function loadPosition() {
        var savedPosition = GM_getValue('clockPosition');
        if (savedPosition) {
            savedPosition = JSON.parse(savedPosition);
            return savedPosition;
        }
        return null;
    }
 // Imposta la lingua predefinita
    var language = GM_getValue('language') || 'it'; // Recupera la lingua dal localStorage o usa 'it' come predefinita
    const languages = {
        en: { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' },
        it: { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' }
    };
    // Funzione per mostrare il clock
function mynascond() {
if(document.getElementById('clockBox').style.display = (document.getElementById('clockBox').style.display!='none') ? 'none' : 'block');}
GM_registerMenuCommand("mostra pulsante/nascondi",mynascond);

      // Menu comando per cambiare lingua
    function changeLanguage() {
        language = (language === 'it') ? 'en' : 'it';
        GM_setValue('language', language); // Salva la lingua scelta nel localStorage
        alert(`Lingua cambiata a: ${language}`);
    }
    GM_registerMenuCommand("Cambia Lingua", changeLanguage);

    // Avvia la funzione dopo che la pagina è stata caricata
    $(document).ready(function() {
        const body = document.body;
        if (window.top != window.self) return;
        var box = document.createElement("div");
        box.setAttribute("id", "clockBox");
        box.setAttribute("style","width:350px;margin:10px;color:red;border-radius:10px;border:2px solid green;font-family:sans-serif;font-size:16pt;background-color:blue;position:fixed;text-align:center;z-index:99999;display:block;");

        // Carica la posizione dal local storage
        var savedPosition = loadPosition();
        if (savedPosition) {
            box.style.top = savedPosition.top + 'px';
            box.style.left = savedPosition.left + 'px';
        } else {
            box.style.top = '500px'; // Posizione predefinita se non ci sono dati salvati
        }

       document.body.appendChild(box);

        function tick(){
            var d = new Date();
            var options = languages[language]; // Usa la lingua salvata
            var t = d.toLocaleTimeString();
            var ms = new Date().getMilliseconds(); // millisecondi
            var date = d.toLocaleString(language, options);
            box.innerHTML = date + " " + t + ":" + ms;
        }

        $(box).draggable({
             containment: "window", // Assicura che l'elemento draggable sia confinato alla finestra del browser
            // Salva la posizione immediatamente dopo ogni spostamento
            drag: function(event, ui) {
                savePosition(ui.position.top, ui.position.left);
            }
        });

        body.append(box);
        tick();
        setInterval(tick, 70);
    });
})();

