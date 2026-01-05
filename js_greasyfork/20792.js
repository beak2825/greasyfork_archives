// ==UserScript==
// @name         AutoJoin en Grupo Steam
// @namespace    Namespace
// @version      0.1.0
// @description  Entra automaticamente en el grupo de la pagina de Steam
// @author       Raul
// @match        *://steamcommunity.com/groups/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20792/AutoJoin%20en%20Grupo%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/20792/AutoJoin%20en%20Grupo%20Steam.meta.js
// ==/UserScript==

/**********************************************************************************************************/
/* * * * * * * * * * * * * * * * * * * * * Leave the rest below alone * * * * * * * * * * * * * * * * * * */
/**********************************************************************************************************/

function closePage(miliseconds) {
    setInterval(function(){
        console.log("cierra");
        window.close();
    }, miliseconds);
}

$(document).ready(function() {
    
    //console.log("entra");
    var div_del_boton_verde = $(".grouppage_join_area");
    //console.log(div_del_boton_verde);
    
    var boton_verde = div_del_boton_verde.find(".btn_green_white_innerfade");
    //console.log(boton_verde);
    
    if (boton_verde.length==1)
    {
        //$(boton_verde).trigger('click');
        //$(div_del_boton_verde).trigger('click');
        eval("javascript:document.forms['join_group_form'].submit();");
        closePage(3000);
    }
    
    
});
