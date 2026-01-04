// ==UserScript==
// @name          checkbox sfoca chat figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       1.4
// @description   casella di controllo anti spioni
// @author        figuccio
// @match         https://*.facebook.com/*
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @icon          https://facebook.com/favicon.ico
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/476060/checkbox%20sfoca%20chat%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/476060/checkbox%20sfoca%20chat%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
var $ = window.jQuery.noConflict();
//avvia la funzione dopo che la pagina e stata caricata
$(document).ready(function() {
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
var body=document.body;
var style="position:fixed; top:0px;left:300px;z-index:99999;"
var box=document.createElement("div");

box.id = "sfoca";
box.style = style;
body.append(box);
 // Ripristina la posizione salvata se presente
const savedPosition = GM_getValue('boxPosition');
if (savedPosition) {
    const parsedPosition = JSON.parse(savedPosition);
    $(box).css({ top: parsedPosition.top, left: parsedPosition.left });
}
     // Rendi l'elemento trascinabile con limitazioni di schermo
    makeDraggableLimited($(box));
//////////////////////////////////////
 //mostra/nascondi dal menu
function nascondi() {
var box = document.getElementById('sfoca');
box.style.display = ((box.style.display!='none') ? 'none' : 'block');
}
GM_registerMenuCommand("nascondi/mostra box",nascondi);
    //////////////////////////////////////////
function toggleChatBlur(blurEnabled) {
  const contactList = document.querySelector(".xwib8y2 ul");
  const checkbox = document.getElementById("showHideButton");
  // Applica o rimuovi il filtro blur
  contactList.style.filter = blurEnabled ? "blur(7px)" : "";
  // Aggiorna il testo del pulsante
  checkbox.value = blurEnabled ? "Show Chat 😃" : "Hide Chat 😩";
  // Salva lo stato della checkbox
  GM_setValue("checkboxState", blurEnabled.toString());
}

$(document).ready(function() {
  const checkbox = $("#showHideButton");
  // Carica lo stato salvato all'avvio
  const savedState = GM_getValue("checkboxState") === "true";
  checkbox.prop("checked", savedState);
  toggleChatBlur(savedState);

  // Gestisci il cambio di stato della checkbox
  checkbox.change(function() {
  toggleChatBlur(this.checked);
  });
});

// Assicurati che il blur sia applicato anche quando la pagina è completamente caricata
document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    const savedState = GM_getValue("checkboxState") === "true";
    if (savedState) {
    toggleChatBlur(true);
    }
  }
};
    // Aggiungi un MutationObserver per monitorare i cambiamenti nel DOM
        const observer = new MutationObserver(() => {
        const checkboxState = document.getElementById("showHideButton").checked;
        toggleChatBlur(checkboxState);
    });
    // Configura e osserva il body del documento
    observer.observe(document.body, { childList: true, subtree: true });
    ////////////////////////////////
  GM_addStyle(`
      #showHideButton{cursor:pointer;margin-right:80px;}

      input[type=checkbox] {accent-color:red;}

      [type=checkbox]:after {
      content: attr(value);
      margin: -2px 19px;
      vertical-align: top;
      display:;
      white-space:nowrap;
      color:lime;
      background:brown;
}

     /* bordo casella */
     input[type="checkbox"] {
     outline: 3px solid lime;
}

     /*ingrandisce checkbox */
     input[type="checkbox"] {
     cursor:; /*sulla checkbox*/
     width:16px;
     height:16px;
}

   /*se cliccata*/
      input[type="checkbox"]:checked {
      outline: 3px solid yellow;
}

    /*se cliccata colore testo*/
      input[type=checkbox]:checked::after{
      content: attr(value);
      margin: -2px 19px;
      vertical-align:top;
      display: ;
      white-space:nowrap;
      color:red;
      background:aquamarine;
      cursor:; /*sulla scritta*/
}

    `);
//elemento html nel div
    box.innerHTML=`
                   <fieldset style="background:#3b3b3b; border: 2px solid red;color:lime;border-radius:7px;text-align:center;width:80px;">
                   <legend>Sfoca Chat </legend>
   <div id=setui>
 <input type="checkbox"  id="showHideButton"   title="Sfoca"   value="Hide Chat 😩"/><br>

                    </fieldset>
            `;

})();

})();
