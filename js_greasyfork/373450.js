// ==UserScript==
// @name         CustomVehicles
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Fahrzeugtyp umbennen + eigene AAO
// @author       JuMaHo
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373450/CustomVehicles.user.js
// @updateURL https://update.greasyfork.org/scripts/373450/CustomVehicles.meta.js
// ==/UserScript==

(function() {


    function fz_edit(fz_id,fz_type,fz_color){
$( "a[href$='/vehicles/" + fz_id + "']" ).next().text('(' + fz_type +')');
    if($( "a[href$='/vehicles/" + fz_id + "/edit']" ).length > 0){
        $( "a[href$='/fahrzeugfarbe/" + fz_color + "']" ).text('' + fz_type + '');
    }
}

    function aao(aao_id,custom_id){
$("#aao_" + aao_id + "").click(function(){
    $(".vehicle_checkbox").each(function(){
        var vehicle_checkid = $(this).attr("custom_id");
        var vehicle_id = $(this).attr("value");

        if($("#vehicle_checkbox_" + vehicle_id + "").prop('checked') === false) {
        if(vehicle_checkid === '' + custom_id + ''){
            $("#vehicle_checkbox_" + vehicle_id + "").click();
        return false;
        }
      }

    });
 });
}

    function add_custom_id(vehicle_id,custom_id){
         $('#vehicle_checkbox_' + vehicle_id + '').attr('custom_id', '' + custom_id + '');
    }

    /***************************************************************************************/
    add_custom_id(12645389,54321); //Fahrzeug eine neuen Unterkategorie zuweisen
    fz_edit(12645389,'GW-Tier',30); //Typenbezeichnung in Einsatzliste und Wache anpassen
    aao(2593847,54321); //Fahrzeugkategorie einem AAO Button zuweisen
   /***************************************************************************************/
   
})();