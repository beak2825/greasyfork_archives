// ==UserScript==
// @name          clock Facebook figuccio data-time
// @namespace     https://greasyfork.org/users/237458
// @version       1.2
// @author        figuccio
// @description   data ora calendario
// @match         https://*.facebook.com/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at        document-start
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon          data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @noframes
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/454157/clock%20Facebook%20figuccio%20data-time.user.js
// @updateURL https://update.greasyfork.org/scripts/454157/clock%20Facebook%20figuccio%20data-time.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const $ = window.jQuery.noConflict(); // Evita triangolo giallo

    // Aggiungi la funzione per il trascinamento limitato allo schermo
    function makeDraggableLimited(element) {
        element.draggable({
            containment: "window",
            stop: function(event, ui) {
                // Memorizza la posizione dopo il trascinamento
                GM_setValue('boxPosition', JSON.stringify(ui.position));
            }
        });
    }

    // Creazione del contenitore
    const body = document.body;
    const style = "position:fixed; top:0; left:760px; z-index:99999;";
    const box = document.createElement("div");
    box.id = "mydata";
    box.style = style;
    body.append(box);

    // Ripristina la posizione salvata, se presente
    const savedPosition = GM_getValue('boxPosition');
    if (savedPosition) {
        const parsedPosition = JSON.parse(savedPosition);
        $(box).css({ top: parsedPosition.top, left: parsedPosition.left });
    }

    // Rendi l'elemento trascinabile con limitazioni di schermo
    makeDraggableLimited($(box));

    // Funzione per mostrare/nascondere il box
    function toggleBoxVisibility() {
        box.style.display = (box.style.display !== 'none') ? 'none' : 'block';
    }

    GM_registerMenuCommand("Nascondi/Mostra Time", toggleBoxVisibility);

    // Timer per aggiornare l'ora e la data
    setInterval(myTimer, 70);
    function myTimer() {
        var d = new Date();
        var t = d.toLocaleTimeString();
        var mm = d.getMilliseconds(); // Millisecondi
        var date = new Date().toLocaleString('it', {'weekday': 'short', 'month': '2-digit', 'day': '2-digit','year':'numeric'
    });
    document.getElementById("datePicker1").innerHTML = date + " " + t + mm;
}
    // Inserimento del layout
    box.innerHTML = `
        <fieldset style="background:#3b3b3b;border:2px solid red;color:lime;border-radius:7px;text-align:center;height:35px;width:200px;">
            <legend>DATA-TIME</legend>
           <div id=setuiclock style="width:auto;height:25px;margin:-12px;border-width:1px;">
                <div id="datePicker1" style="background:#3b3b3b;color:lime;border:1px solid yellow;font-size:16px;border-radius:5px;margin:9px;text-align:center;width:max-content;">
                </div>

        </fieldset>
    `;
})();

