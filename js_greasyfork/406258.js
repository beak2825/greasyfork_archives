// ==UserScript==
// @name           Clock figuccio migliore
// @description    clock compare data se passi il mouse sopra
// @version        1.5
// @match          *://*/*
// @run-at         document-start
// @author         figuccio
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon           data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @namespace      https://greasyfork.org/users/237458
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/406258/Clock%20figuccio%20migliore.user.js
// @updateURL https://update.greasyfork.org/scripts/406258/Clock%20figuccio%20migliore.meta.js
// ==/UserScript==
(function() {
    'use strict';
     var $ = window.jQuery;
     var clockVisible = true; // Variabile per monitorare la visibilità dell'orologio
 // Comando del menu Registra per attivare/disattivare la visibilità dell'orologio
        GM_registerMenuCommand(clockVisible ? "Nascondi orologio" : "Mostra orologio", function() {
            if (clockVisible) {
                $("#b").hide();
                clockVisible = false;
            } else {
                $("#b").show();
                clockVisible = true;
            }
        });

    // Funzione per aggiornare l'orologio
    function Clock() {
        var date = new Date();
        var mm = date.getMilliseconds(); //millisecondi
        var ore = date.toLocaleString('it', {
        hour: '2-digit',
        minute: 'numeric',
        second: 'numeric',
        });
        node.innerHTML = ore + ":" + mm;
    }

    // Creare l'elemento di visualizzazione dell'ora
    var node = document.createElement('div');
    node.id = "b";
    node.title = 'time';
    node.setAttribute("style", "cursor:pointer;padding:4px;background:black;color:lime;top:0px;left:800px;font-family:sans-serif;font-size:14px;position:fixed;text-align:center;z-index:999999;border-radius:10px;border:2px solid yellow;");
    document.body.appendChild(node);

    // Funzione per aggiornare la data premendo il mouse
    function updateDateOnMouseEnter() {
        let currentDate = new Date();
        node.setAttribute('title', currentDate.toLocaleDateString('it', {day:'2-digit', month:'long', weekday:'long', year:'numeric'}));
    }

    // Aggiungi l'evento mouseenter alla data di aggiornamento
    $(node).mouseenter(updateDateOnMouseEnter);

    // Rendi trascinabili gli elementi dell'orologio
   $(document).ready(function() {
    $("#b").draggable({
        containment: "window", // Limita il trascinamento
        stop: function(event, ui) {
            GM_setValue('clockPosition', JSON.stringify({ top: ui.position.top, left: ui.position.left }));
        }
    });

        // Carica la posizione dalla memoria GM
        var savedPosition = GM_getValue('clockPosition');
        if (savedPosition) {
            var position = JSON.parse(savedPosition);
            $("#b").css({
            top: position.top,
            left: position.left
            });
        }
  window.addEventListener('beforeunload', function() {
        var currentPosition = $("#b").position();
        GM_setValue('clockPosition', JSON.stringify({ top: currentPosition.top, left: currentPosition.left }));
    });
});

    //Aggiorna l'orologio ogni 70
    setInterval(Clock, 70);

})();
