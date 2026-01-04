// ==UserScript==
// @name         fasterSS
// @namespace    leo@fasterenlinea.com.ar
// @version      0.1
// @description  Permite saber que AP se encuentran en el site survey
// @author       Leo Demartin
// @grant        none
// @require      https://greasyfork.org/scripts/370883-nodos/code/Nodos.js?version=617960
// @include      */survey.cgi
// @exclude      http://192.168.0.7/
// @exclude      https://172.16.0.1:815*
// @icon         https://k60.kn3.net/2/F/C/C/B/E/954.png
// @downloadURL https://update.greasyfork.org/scripts/370884/fasterSS.user.js
// @updateURL https://update.greasyfork.org/scripts/370884/fasterSS.meta.js
// ==/UserScript==

(function() {
    'use strict'; 

    //Creo el boton para usar en el site survey
    var nodoNames = document.createElement('button');
    //Asigno el texto
    $(nodoNames).html('Nodos');
    //Funcion que inicia al hacer clic en el botón
    nodoNames.onclick = cantNodos;
    //Agrego el boton
    document.getElementById('survey').before(nodoNames);
    //Funcion al hacer clic en el botón de nodos
    function cantNodos(){
        var table = document.getElementById('survey'); //Asigno a la variable Table la tabla de resultados del SS
        var rowCount = table.rows.length; // Cuento cuantas columnas hay
        for(var c=0; c<rowCount; c++){ // Recorro los elementos de la tabla para agregar una nueva columna al principio
            var row = table.rows[c]; // Variable que almacena la columna
            row.insertCell(1); // Agrego una nueva celda a cada columna
       }//fin for
        var cantidad = (document.querySelector('#survey')).querySelectorAll('tr').length; //Cuento las filas (nodos descubiertos)
        for (var i=1; i<cantidad; i++){ //Recorro las nuevas celdas
            var mac=document.getElementById('survey').rows[i].cells[2].innerText; // Almaceno la mac para buscarla en el array
            if (nodos[mac]){//Si la mac es de un AP de FASTER
                document.getElementById('survey').rows[i].cells[1].innerHTML = '<a href='+ nodos[mac][1] + ' target="_blank"> '+ nodos[mac][0] + '</a>';}
        }//fin for
        nodoNames.disabled=true;//deshabilito el botón*/

    }//fin función cantNodos
})();