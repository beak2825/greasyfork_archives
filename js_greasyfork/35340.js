// ==UserScript==
// @name         fasterNODOS
// @namespace    leo@fasterenlinea.com.ar
// @version      1.15.1
// @description  Ver AP al que esta conectado un CPE
// @author       Leo Demartin
// @grant        none
// @require      https://greasyfork.org/scripts/370883-nodos/code/Nodos.js
// @include      */index.cgi
// @include      */survey.cgi*
// @exclude      http://192.168.0.7/
// @exclude      https://172.16.0.1:815*
// @icon         https://k60.kn3.net/2/F/C/C/B/E/954.png
// @downloadURL https://update.greasyfork.org/scripts/35340/fasterNODOS.user.js
// @updateURL https://update.greasyfork.org/scripts/35340/fasterNODOS.meta.js
// ==/UserScript==


(function() {
    'use strict';
 if( window.location.pathname === "/index.cgi"){ //
     $('.foottext').append(' - Script fasterNodos V 1.15.1 (17/09/18) - Leo Demartin');
     //Modifico tamaño de span que contiene MAC para que entre el botón
     $(apmac).css('width', '100px');

     //Creo el boton nombreNodo
     var nombreNodo = document.createElement('button');
     $(nombreNodo).html('Ver Nodo');
     //Agrego el boton luego de la MAC
     document.getElementById('apmacinfo').append(nombreNodo);

     //Llamo a la funcion al hacer clic en botón
     nombreNodo.onclick = verNodo;
     //Se ejecuta la función al hacer clicen boton
     function verNodo() {
         // En la variable txt copio el valor de la MAC
         var txt = document.getElementById('apmac').innerHTML;
         // En la variable btnvalue paso el valor del texto del botón
         var btnvalue = $(nombreNodo).html();
         //Si el texto del botón es "Ver nodo" camio el texto del boton por el nombre del nodo
         if (btnvalue === 'Ver Nodo')
             $(nombreNodo).html(nodos[txt][0]);
         //Si el texto del botón ya tiene el nombre del nodo abro en nueva venta la ip del nodo
         else
             window.open(nodos[txt][1], '_blank');}

     //Creo el boton Site Survey
     var ss = document.createElement('button');
     $(ss).html('Site Survey');
     //Agrego el boton luego de la MAC
     //document.getElementsByClassName('linktable')[0].before(ss);
     document.getElementById('signal').after(ss);
     ss.onclick = abrirSS;

     function abrirSS(){
         window.open('survey.cgi?mode=tool', '_blank');
     }
 }else if( window.location.pathname === "/survey.cgi"){
 //Creo el boton para usar en el site survey
    var nodoNames = document.createElement('button');
    //Asigno el texto
    $(nodoNames).html('Nodos');
    //Margen, ancho y padding
    $(nodoNames).css('margin-bottom', '10px');
    $(nodoNames).css('width', '180px');
    $(nodoNames).css('padding', '10px');
    //Funcion que inicia al hacer clic en el botón
    nodoNames.onclick = cantNodos;
    //Agrego el boton
    document.getElementById('survey').before(nodoNames);
    //Funcion al hacer clic en el botón de nodos
    function cantNodos(){
        document.getElementById('survey').rows[0].cells[6].click();//ordenamos por señal
        var table = document.getElementById('survey'); //Asigno a la variable Table la tabla de resultados del SS
        var rowCount = table.rows.length; // Cuento cuantas columnas hay
        for(var c=0; c<rowCount; c++){ // Recorro los elementos de la tabla para agregar una nueva columna al principio
            var row = table.rows[c]; // Variable que almacena la columna
            row.insertCell(1); // Agrego una nueva celda a cada columna
       }//fin for
       //Primer td a th
        document.getElementById('survey').rows[0].cells[1].outerHTML = "<th>Nodo</th>";
        var cantidad = (document.querySelector('#survey')).querySelectorAll('tr').length; //Cuento las filas (nodos descubiertos)
        for (var i=1; i<cantidad; i++){ //Recorro las nuevas celdas
            var mac=document.getElementById('survey').rows[i].cells[2].innerText; // Almaceno la mac para buscarla en el array
            if (nodos[mac]){//Si la mac es de un AP de FASTER
                document.getElementById('survey').rows[i].cells[1].innerHTML = '<a href='+ nodos[mac][1] + ' target="_blank"> '+ nodos[mac][0] + '</a>';
                document.getElementById('survey').rows[i].style.backgroundColor = "#d9ff40"; //Fondo fluorescente a las filas con nodos
            }
        }//fin for
        nodoNames.disabled=true;//deshabilito el botón

    }//fin función cantNodos
}//fin del if sitesurvey

})();