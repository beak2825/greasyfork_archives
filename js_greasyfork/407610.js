// ==UserScript==
// @name         Cartera opciones
// @namespace    http://tampermonkey.net/
// @version      0.53
// @description  Prueba de cartera opciones
// @author       Juanvi
// @match        https://finance.yahoo.com/quotes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407610/Cartera%20opciones.user.js
// @updateURL https://update.greasyfork.org/scripts/407610/Cartera%20opciones.meta.js
// ==/UserScript==

//Firefox 68.8.1

(function() {
    'use strict';

//setTimeout(function(){ var fila=document.getElementsByClassName('List(n) M(0) P(0)')[0].firstChild.firstChild.firstChild; alert(fila.firstChild.innerText+'--'+fila.getElementsByClassName('Trsdu(0.3s) ')[0].innerText); }, 15000);

   setTimeout(cartera,10000);
    function cartera(){
      var hoy=new Date();
//var fila=document.getElementsByClassName('List(n) M(0) P(0)')[0].firstChild.firstChild.firstChild; 
//alert(document.getElementsByClassName('List(n) M(0) P(0)')[0].innerHTML);
//alert(fila.firstChild.innerText+'-->'+fila.getElementsByClassName('Trsdu(0.3s) ')[0].innerText); 
          var tablamovil=document.getElementsByClassName('List(n) M(0) P(0)')[0].children;
//alert(tablamovil.length);
          for (var j=0;j<tablamovil.length;j++){
            var filamovil = tablamovil[j].firstChild.firstChild;
            //alert(filamovil.firstChild.innerText+'-->>'+filamovil.getElementsByClassName('Trsdu(0.3s) ')[0].innerText); 
           var tae=calcula_tae(filamovil.firstChild.innerText, filamovil.getElementsByClassName('Trsdu(0.3s) ')[0].innerText,hoy);
filamovil.getElementsByClassName('Trsdu(0.3s) Pend(10px) Bdrs(3px)')[0].parentElement.innerHTML=parseFloat(tae).toFixed(2);

         }
      
        function calcula_tae(contrato, valor,hoy){
            var strike=contrato.substring(contrato.length-8)/1000;
            var vencimiento=new Date('20'+contrato.substring(contrato.length-15,contrato.length-13),contrato.substring(contrato.length-13,contrato.length-11)-1,contrato.substring(contrato.length-11,contrato.length-9));
            var dias=(vencimiento.getTime()-hoy.getTime())/86400000;
            return (100*valor*365)/(strike*(dias+2));
        }
    }

})();