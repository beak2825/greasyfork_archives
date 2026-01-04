// ==UserScript==
// @name          list-color clock Facebook figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       1.7
// @author        figuccio
// @description   data ora calendario lista colori
// @match         *://*/*
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
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/463011/list-color%20clock%20Facebook%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/463011/list-color%20clock%20Facebook%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
   ///////////////////////time-list color///////////
var $ = window.jQuery.noConflict();
//avvia la funzione dopo che la pagina e stata caricata
$(document).ready(function() {
var body=document.body;
var style="position:fixed;top:0px;left:760px;z-index:99999;"
var box=document.createElement("div");

box.id="mylist";
box.style=style;
$(box).draggable();
body.append(box);

function provalist(){
var box = document.getElementById('mylist');
box.style.display = ((box.style.display!='none') ? 'none' : 'block');
}
GM_registerMenuCommand("nascondi/mostra time",provalist);
///////////////////////////////////////////////////////////////
   //Imposta lo stile CSS degli elementi nel menu  (#setui aggiungere altre lettere accanto per non interferire con altri script simili resta centrata)
  GM_addStyle(`
  #setuitu{width:auto;height:25px; margin-top:-6px;margin-left:-10px; margin-right:-12px;margin-bottom:0px;border-width:1px;}
  #selectColor{background:#3b3b3b;color:lime;border:1px solid yellow; border-radius:5px;}
            `);
let use12HourFormat = GM_getValue('use12HourFormat', true); // Default è il formato 24 ore
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

    if (!use12HourFormat) {
        period = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12; // Converte in formato 12 ore
    }

    hours = String(hours).padStart(2, "0");

    const clockElement = document.getElementById('datePicker1');
    if (clockElement) {
        clockElement.value = `${date} ${hours}:${minutes}:${seconds}:${milliseconds}${period}`;
    }
}
  // Funzione per cambiare lingua
function changeLanguage() {
    language = (language === 'it') ? 'en' : 'it';
    GM_setValue('language', language); // Salva la lingua scelta nel localStorage
}
function toggleFormat() {
    //Cambia il formato orario
    use12HourFormat = !use12HourFormat;
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
}
// Crea il menu e inizializza il setInterval
GM_registerMenuCommand("Cambia Lingua", changeLanguage);
GM_registerMenuCommand("Cambia formato orario 12/24", toggleFormat);
setInterval(updateClock, 90);
    ///////////////////////stile colori
$(function(){
$("select").change(function(){
var $selectedOption = $(this).find("option:selected");
$(this).removeAttr("style").attr("style", $selectedOption.attr("style"));
});
});
    /////////////////////////local storage///////////
              //mantiene il colore della lista cambia colore pagina
    $(function() {
    $('#selectColor').change(function() {
    GM_setValue('lista', this.value);
        //backgroundColor su google search risolve il problema che bisognava ricaricare
    document.body.style.backgroundColor=GM_getValue('lista');
    /////////////barra facebook
   // $("div[aria-label=Facebook][role=navigation]").css("background-color" ,GM_getValue("lista"));
    });
/////////////////////////////////////////////////recupero storage
     if(GM_getValue('lista')){
     $('#selectColor').val(GM_getValue('lista'));
     document.getElementById('selectColor').value =GM_getValue('lista');
     document.body.style.backgroundColor=GM_getValue('lista');
     /////barra facebook
   //  $("div[aria-label=Facebook][role=navigation]").css("background-color" ,GM_getValue("lista"));
    }
});

 // width:250px evita che spostandolo hai lati cambi di dimensioni
    box.innerHTML=`
                     <fieldset style="background:#3b3b3b;border:2px solid red;color:lime;border-radius:7px;text-align:center;width:310px;height:40px;">
                            <legend>LIST-COLOR</legend>
  <div id=setuitu>

  <select  id="selectColor" title="Selettore colori">
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
 <input id="datePicker1"  title="Data-ora" style="background:#3b3b3b;color:lime;border:1px solid yellow;border-radius:5px;margin:9px;text-align:center;font-size:14px;width:210px;" />

                    </fieldset>
            `;
// Funzione per memorizzare la posizione dopo il trascinamento
    function savePosition() {
        var box = document.getElementById('mylist');
        var position = $(box).offset(); // Ottieni le coordinate della posizione
        GM_setValue('boxPosition', JSON.stringify(position)); // Salva le coordinate nel localStorage
    }

    // Ripristina la posizione dal localStorage
    function restorePosition() {
        var box = document.getElementById('mylist');
        var savedPosition = GM_getValue('boxPosition');
        if (savedPosition) {
            var position = JSON.parse(savedPosition);
            $(box).offset(position); // Ripristina la posizione
        }
    }

    // Esegui la funzione dopo il caricamento della pagina
    restorePosition();

    // Al termine del trascinamento, salva la posizione
    $(box).draggable({
        containment: "window", // Impedisce di trascinarlo fuori dalla finestra del browser
        stop: savePosition
    });

})();
})();

