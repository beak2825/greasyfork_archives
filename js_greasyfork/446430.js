// ==UserScript==
// @name         facebook Color Themes figuccio
// @version      1.2
// @namespace    https://greasyfork.org/users/237458
// @match        https://*.facebook.com/*
// @author       figuccio
// @description  Aggiunge lista colori. Puoi scegliere red, orange, yellow, green, blue,ecc
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @require      https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://facebook.com/favicon.ico
// @grant        GM_registerMenuCommand
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446430/facebook%20Color%20Themes%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/446430/facebook%20Color%20Themes%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;
    $(document).ready(function() {
        var body = document.body;
        var style = "position:fixed; top:-3px;right:500px;z-index:99999;";
        var box = document.createElement("div");

        // Recupera la posizione memorizzata dalla localStorage
        var storedPosition = GM_getValue('position', '');
        if (storedPosition !== '') {
            var [top, left] = storedPosition.split(',');
            style = `position:fixed; top:${top}px; left:${left}px; z-index:99999;`;
        }

        box.id = "myteme";
        box.style = style;
        $(box).draggable({
            containment: "window", // Limita il trascinamento entro i bordi della finestra
            stop: function(event, ui) {
                // Memorizza la nuova posizione nella localStorage
                var position = `${ui.position.top},${ui.position.left}`;
                GM_setValue('position', position);
            }
        });

        // Aggiunta dell'elemento HTML nel div box
        box.innerHTML = `
            <fieldset style="background:#3b3b3b;border:2px solid red;color:lime;border-radius:7px;text-align:center;width:120px!important;height:44px;">
                <legend>Themes figuccio</legend>
<div id=setuii style="width:auto;height:25px;margin-top:0px!important;margin-left:-12px;margin-right:-12px;margin-bottom:0px;border-width:1px;">
<select id="selectColor" title="Selettore colori" style="background:#3b3b3b;color:lime;border:1px solid yellow;border-radius:5px;cursor:pointer;">

                        <option value="">Scegli ...</option>
                        <option style="background-color: Purple" value="Purple">Purple</option>
                        <option style="background-color: Blue" value="Blue">Blue</option>
                        <option style="background-color: Green" value="Green">Green</option>
                        <option style="background-color: Orange" value="Orange">Orange</option>
                        <option style="background-color: Brown" value="Brown">Brown</option>
                        <option style="background-color: Cyan" value="Cyan">Cyan</option>
                        <option style="background-color: Gray" value="Gray">Gray</option>
                        <option style="background-color: Indigo" value="Indigo">Indigo</option>
                        <option style="background-color: Magenta" value="Magenta">Magenta</option>
                        <option style="background-color: Pink" value="Pink">Pink</option>
                        <option style="background-color: Red" value="Red">Red</option>
                        <option style="background-color: Violet" value="Violet">Violet</option>
                        <option style="background-color: Yellow" value="Yellow">Yellow</option>
                        <option style="background-color: Black" value="Black">Black</option>
                        <option style="background-color: lightgreen" value="lightgreen">lightgreen</option>
                        <option style="background-color: lightyellow" value="lightyellow">lightyellow</option>
                        <option style="background-color: lightblue" value="lightblue">lightblue</option>
                        <option style="background-color: lightgrey" value="lightgrey">lightgrey</option>
                    </select>
                    </div>
            </fieldset>
        `;

        body.append(box);

        // Funzione per applicare il colore selezionato
        function applyColor(color) {
            $("div[aria-label=Facebook][role=navigation]").css("background-color", color);
        }

        // Recupera il valore di colore dal local storage
        var storedColor = GM_getValue('color', '');

        // Imposta il colore iniziale
        if (storedColor !== '') {
            applyColor(storedColor);
            $('#selectColor').val(storedColor);
        }

        // Pulizia del local storage se l'utente annulla la selezione
        GM_registerMenuCommand("Reset Color", function() {
            GM_setValue('color', '');
            applyColor('');
            $('#selectColor').val('');
        });

        // Gestisce il cambiamento di colore
        $('#selectColor').change(function() {
            var selectedColor = this.value;

            // Salva il colore selezionato nel local storage
            GM_setValue('color', selectedColor);

            // Applica il colore selezionato
            applyColor(selectedColor);
        });
    });

    // Applica lo stile dei colori
   $(function() {
    $("select").change(function() {
        var $selectedOption = $(this).find("option:selected");
        // Mantieni lo stile esistente e aggiungi il colore di sfondo
        $(this).removeAttr("style").css({
            "background-color": $selectedOption.css("background-color"),
            "cursor": "pointer" // Aggiungi il cursore
        });
    });
});
})();

