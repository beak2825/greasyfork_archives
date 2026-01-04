// ==UserScript==
// @name          Background Color figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       1.3
// @author        figuccio
// @description   lista colori
// @match         *://*/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at        document-start
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @icon          https://www.google.com/favicon.ico
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/395572/Background%20Color%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/395572/Background%20Color%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
var $ = window.jQuery.noConflict();
//avvia la funzione dopo che la pagina e stata caricata
$(document).ready(function() {
var body=document.body;
var style="position:fixed; top:0px;left:70px;z-index:99999;"
var box=document.createElement("div");

box.id="myback";
box.style=style;

box.style=style;
    $(box).draggable({
        containment: "window",
        stop: function(event, ui) {
            // Salva la posizione nella memoria locale quando il div viene trascinato
            GM_setValue('divPosition', {top: ui.position.top, left: ui.position.left});
        }
    });

     // Recupera la posizione dall'archivio locale, se esiste
    var savedPosition = GM_getValue('divPosition');
    if (savedPosition) {
        box.style.top = savedPosition.top + 'px';
        box.style.left = savedPosition.left + 'px';
    }

    body.append(box);
    ///////////////////////
function prova(){
var box = document.getElementById('myback');
box.style.display = ((box.style.display!='none') ? 'none' : 'block');
}
GM_registerMenuCommand("nascondi/mostra time",prova);
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
    GM_setValue('lista1', this.value);
    //backgroundColor su google search risolve il problema che bisognava ricaricare
    document.body.style.backgroundColor=GM_getValue('lista1');
    ///////////////////////////////////barra facebook
    $("div[aria-label=Facebook][role=navigation]").css("background-color" ,GM_getValue("lista1"));
    });
    /////////////////////////////////////////////////recupero storage
     if(GM_getValue('lista1')){
     $('#selectColor').val(GM_getValue('lista1'));
     document.getElementById('selectColor').value =GM_getValue('lista1');
     document.body.style.backgroundColor=GM_getValue('lista1');
     ///////////////////////////////////////////////////////barra facebook
     $("div[aria-label=Facebook][role=navigation]").css("background-color" ,GM_getValue("lista1"));
     /////////////////////////////////////////////////////////////////////////////////////////////
    }
});

 //elemento html nel div readonly datatime non fa comparire licona del calendario
    box.innerHTML=`
         <fieldset style="background:#3b3b3b;border:2px solid red;color:lime;border-radius:7px;text-align:center;width:120px;height:44px;">
                            <legend>Color</legend>
<div id=setuia style="width:auto;height:25px;margin-top:0px!important;margin-left:-12px;margin-right:-12px;margin-bottom:0px;border-width:1px;">
  <select  id="selectColor" title="Selettore colori" style="background:#3b3b3b;color:lime;border:1px solid yellow; border-radius:5px;"onchange="javascript:document.body.style.backgroundColor=this.value;">
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

                    </fieldset>
            `;

})();

})();
