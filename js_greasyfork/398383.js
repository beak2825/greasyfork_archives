// ==UserScript==
// @name          Background giorno/notte
// @namespace     https://greasyfork.org/users/237458
// @version       0.5
// @author        figuccio
// @description   Change theme background color
// @match         *://*/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at        document-start
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon          https://images2.imgbox.com/b3/67/Aq5XazuW_o.png
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/398383/Background%20giornonotte.user.js
// @updateURL https://update.greasyfork.org/scripts/398383/Background%20giornonotte.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery.noConflict();
    // Posizione predefinita
    var defaultPosition = { top: 160, left: 0 };

    // Recupera la posizione salvata o usa la posizione predefinita
    var savedPosition = GM_getValue('boxPosition') || defaultPosition;

    // Aggiungi il box con la posizione salvata o predefinita
    var box = $('<div id="mylist"></div>')
        .css({
            position: 'fixed',
            top: savedPosition.top + 'px',
            left: savedPosition.left + 'px',
            zIndex: 99999
        })
        .draggable({
            containment: 'window', // Limita il trascinamento allo schermo
            stop: function(event, ui) {
                // Salva la posizione dopo il trascinamento
                GM_setValue('boxPosition', ui.position);
            }
        })
        .appendTo('body');
////////////////////////////////
    function provalist(){
var box = document.getElementById('mylist');
box.style.display = ((box.style.display!='none') ? 'none' : 'block');
}
GM_registerMenuCommand("nascondi/mostra time",provalist);
///////////////////////////////////////////////////////

    // Imposta lo stile CSS degli elementi nel menu
    GM_addStyle(`
        #setuitu{width:auto;height:25px; margin-top:-6px;margin-left:-12px; margin-right:-12px;margin-bottom:0px;border-width:1px;}
        #selectColor{background:#3b3b3b;color:lime;border:1px solid yellow; border-radius:5px;}
    `);

    // Aggiungi il menu al box
    box.html(`
        <fieldset style="background:#3b3b3b;border:2px solid red;color:lime;border-radius:7px;text-align:center;width:100px;height:44px;">
            <legend>Menù</legend>
            <div id=setuitu>
                <select  id="selectColor" title="Selettore colori">
                    <option value="">Scegli ...</option>
                    <option style="background-color: Black" value="Black">Black</option>
                    <option style="background-color: white" value="white">White</option>
                </select>
            </div>
        </fieldset>
    `);

    // Imposta l'evento change per il selettore di colori
    $('#selectColor').change(function() {
        var color = $(this).val();
        GM_setValue('lista', color);
        document.body.style.backgroundColor = color;
    });

    // Imposta il colore di sfondo dal valore memorizzato
    if (GM_getValue('lista')) {
        $('#selectColor').val(GM_getValue('lista'));
        document.body.style.backgroundColor = GM_getValue('lista');
    }
})();
