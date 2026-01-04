// ==UserScript==
// @name          Browsing Designer color picker figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       1.8
// @description   color picker background con memoria
// @author        figuccio
// @match         *://*/*
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license       MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/450749/Browsing%20Designer%20color%20picker%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/450749/Browsing%20Designer%20color%20picker%20figuccio.meta.js
// ==/UserScript==
(function() {
'use strict';
    //marzo 2024
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

const $ = window.jQuery.noConflict();
const body=document.body;
const style=" position:fixed; top:1px;left:370px;z-index:99999;"
const box=document.createElement("div");

box.id="my7";
box.style=style;
body.append(box);
 // Ripristina la posizione salvata se presente
const savedPosition = GM_getValue('boxPosition');
if (savedPosition) {
    const parsedPosition = JSON.parse(savedPosition);
    $(box).css({ top: parsedPosition.top, left: parsedPosition.left });
}
    ////////////////////////////////////////////marzo 2024
     // Rendi l'elemento trascinabile con limitazioni di schermo
    makeDraggableLimited($(box));
    /////////////////////////////////
function prova(){
var box = document.getElementById('my7');
box.style.display = ((box.style.display!='none') ? 'none' : 'block');
}
GM_registerMenuCommand("nascondi/mostra box",prova);
/////////////////////////////// funzione chiudi menu da close funziona
function myFunction() {
document.getElementById("my7").style.display = "none";
}

/////////////////////////////////////////////////////////////////////
        //dati per la conservazione
        const userdata = {color: 'mio colore'}
        var mycolor = GM_getValue(userdata.color, "#ff0000"); // Valore predefinito   (marzo 2025)
/////////////////////////////////////////////////////////////////////////////////////
     function saveSetting(color) {GM_setValue(userdata.color,mycolor );
     $('body,div[aria-label="Facebook"][role="navigation"]').css("background-color", mycolor);
          }
     // Aggiungi un MutationObserver per monitorare i cambiamenti nel DOM
        const observer = new MutationObserver(() => {
        saveSetting(mycolor); // Applica il colore ogni volta che cambia il DOM
    });
    // Configura e osserva il body del documento
    observer.observe(document.body, { childList: true, subtree: true });
   ///////////////////////////////////////////////////////////
            //Imposta lo stile CSS degli elementi nel menu
        GM_addStyle(`
                #myMenu {
                    font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', Arial, sans-serif;
                    font-size: 14px;
                    z-index: 2147483648;
                }
                 .button {
                    padding: 3px 6px;
                    line-height: 16px;
                    margin-top:-19px;
                    display: inline-block;
                    border: 1px solid black;
                    border-radius: 3px;
                    cursor: pointer;
                    background:chocolate;

                }

                #colorspan { margin-left:1px; margin-bottom:-19px;}

                #seletcolor{margin-top:-47px; margin-left:5px;}

                #setuibd{
                    width:auto;
                    height:35px;
                    margin-top:-3px;
                    margin-left:10px;
                    margin-right:10px;
                    margin-bottom:5px;
                    border-width:1px;
                    color:lime;

                }

                #colorinput{ margin-left:4px; margin-top:4px;height:22px;width:50px;}
                #colorspan{ color:lime;background-color:brown; border: 1px solid blue;}
            `);

  //elemento html nel div
   box.innerHTML=`
                      <fieldset style="background:green; border: 2px solid red;color:lime;border-radius:7px;text-align:center; width:180px;height:35px;">
                      <legend>Select Color</legend>
    <div id=setuibd>
   <button id="colorspan"title="Hex value">${mycolor}</button><input type="color" list="colors" id="colorinput" value="${mycolor}" title="color picker">
   <span class="button" title="chiudi" id='close'>close</span>
                     </fieldset>
            `;
            //////////////////////////////
            //aggiunta span close per chiudere il box direttamente
            var colorinputsetMenuClose=document.querySelector('#close');
            colorinputsetMenuClose.addEventListener('click',myFunction,false);

            ////////////////////////////////////////
            var colorinput=document.querySelector('#colorinput');
            var colorspan = document.querySelector('#colorspan');
            ////////////////////////////////////////
           //evento della tavolozza dei colori
            colorinput.addEventListener('input', colorChange, false);
            function colorChange (e) {
            mycolor = e.target.value;
            colorspan.innerHTML=e.target.value;
            //colore immediatamente visibile
        GM_setValue(userdata.color, mycolor);
        saveSetting(mycolor);
            }

})();

