// ==UserScript==
// @name          color picker figuccio inspirato ha (Eye-protection Mode)
// @namespace     https://greasyfork.org/users/237458
// @version       2.6
// @description   Color picker con box value hex
// @author        figuccio
// @match         https://*.facebook.com/*
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @icon          https://facebook.com/favicon.ico
// @run-at        document-start
// @noframes
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/450577/color%20picker%20figuccio%20inspirato%20ha%20%28Eye-protection%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450577/color%20picker%20figuccio%20inspirato%20ha%20%28Eye-protection%20Mode%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery.noConflict();
    const body = document.body;
    var style = "position:fixed; top:0px;left:720px;z-index:99999;";
    const box = document.createElement("div");
    box.id = "myMenu";
    box.style = style;
    $(box).draggable();
    body.appendChild(box);
/////////////////////////////////////
     // Aggiungi la funzione per il trascinamento limitato allo schermo
function makeDraggableLimited(element) {
    element.draggable({
        containment: "window",
        stop: function(event, ui) {
            // Memorizza la posizione dopo il trascinamento
            GM_setValue('boxPosition', JSON.stringify(ui.position));//importante
        }
    });
}
///////////////////
      // Ripristina la posizione salvata se presente
const savedPosition = GM_getValue('boxPosition');
if (savedPosition) {
    const parsedPosition = JSON.parse(savedPosition);
    $(box).css({ top: parsedPosition.top, left: parsedPosition.left });
}
     // Rendi l'elemento trascinabile con limitazioni di schermo
    makeDraggableLimited($(box));
    ////////////////////////////////
    // Mostra/nascondi il menu
    function toggleMenu() {
        var box = document.getElementById('myMenu');
        box.style.display = (box.style.display !== 'none') ? 'none' : 'block';
    }

    GM_registerMenuCommand("Nascondi/Mostra Box", toggleMenu);

    var userdata = { color: 'figuccio' };
    let mycolor = GM_getValue(userdata.color, "#980000");

    // Salva i dati personalizzati
    function saveSetting(color) {
        GM_setValue(userdata.color, mycolor);
        $('div[aria-label="Facebook"][role="navigation"]').css("background-color", mycolor);
    }
        // Aggiungi un MutationObserver per monitorare i cambiamenti nel DOM
        const observer = new MutationObserver(() => {
        saveSetting(mycolor); // Applica il colore ogni volta che cambia il DOM
    });

    // Configura e osserva il body del documento
    observer.observe(document.body, { childList: true, subtree: true });
////////////////////////////////////////////////////////////////////////
    // Imposta lo stile CSS degli elementi nel menu
    GM_addStyle(`
     #myMenu {font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', Arial, sans-serif;font-size:14px;z-index:2147483648;}

     #myMenu .button {padding: 3px 6px;line-height:16px;margin-top:6px;display:inline-block;}

     #colorspan {margin-left:0px; margin-bottom:-19px;color:lime;background-color:brown;border:1px solid yellow;border-radius:5px;cursor:pointer;}

     #setui {width:auto;height:25px; margin-top:-9px;margin-left:9px; margin-right:-4px;margin-bottom:0px;border-width:1px;color:lime;}

     #colorinput{margin-left:4px; margin-top:12px; background-color:#3b3b3b; color:red;border:1px solid yellow;border-radius:5px;height:20px;width:70px;cursor:pointer;}
     #demo{border:1px solid yellow;border-radius:5px;cursor:pointer;text-align:;margin-top:-7px;font-size:14px;width:max-content;}
    `);

setInterval(myTimer,90);
function myTimer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    var mm = d.getMilliseconds();
    var date = new Date().toLocaleString('it', {'weekday': 'short', 'month': '2-digit', 'day': '2-digit','year':'numeric'
    });
    document.getElementById("demo").innerHTML = date + " " + t + ":" + mm;
}

    // Elemento HTML all'interno del div
    box.innerHTML = `
        <fieldset style="background:#3b3b3b; border:1px solid red;color:lime;border-radius:7px;text-align:center;height:px;width:px;">
            <div id="demo"  title="Data-ora" ></div>
                       <legend>Time</legend>
                <div id="setui">
                     <button id="colorspan"title="Hex value">${mycolor}</button> <input type="color" list="colors" id="colorinput" value="${mycolor}" title="color picker">
                    <span class="button" title="chiudi" id='close'style="background-color:red; color:lime;border:1px solid yellow;border-radius:50%;cursor:pointer;">X</span>
        </fieldset>
    `;

    // Serie di elementi get
    var colorSpan = document.querySelector('#colorspan');
    var colorInput = document.querySelector('#colorinput');
    var closeButton = document.querySelector('#close');

    // Aggiunta di eventi di ascolto
    colorInput.addEventListener('input',colorChange, false);
    function colorChange (e) {
        mycolor = event.target.value;
        colorSpan.innerHTML = event.target.value;
      //colore immediatamente visibile
     GM_setValue(userdata.color, mycolor);
        saveSetting(mycolor);
        }
    closeButton.addEventListener('click', toggleMenu, false);
})();
