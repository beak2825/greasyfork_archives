// ==UserScript==
// @name         antivenek
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  hecho por el otako de hispachan
// @author       You
// @match        https://www.hispachan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382007/antivenek.user.js
// @updateURL https://update.greasyfork.org/scripts/382007/antivenek.meta.js
// ==/UserScript==

var paises;
paises=["https://www.hispachan.org/assets/countryballs/ve.png"];
    
    //hecho por el otako de hispachan

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function quitar(tipo){
    var ocultar=document.getElementsByClassName(tipo);
   var a=0;
    var b=0;
var c=0;

for(a=0;a<ocultar.length;a++){
 var banderita=ocultar[a].getElementsByClassName("bandera");
 for(b=0;b<banderita.length;b++){
     for(c=0;c<paises.length;c++){
     if(banderita[b].src==paises[c]){
         if(tipo=="reply"){
          ocultar[a].parentNode.parentNode.removeChild(ocultar[a].parentNode);
          }
         else{
             ocultar[a].parentNode.removeChild(ocultar[a]);
         }
          a--;
         break;
     }
 }

 }
}}



async function eventofun(x){

var respuestas=x.target.resp;

    toggleHiddenReplies(x.target.param1,x.target.param2);
await sleep(1000);
    quitar("reply");
}

var av=0;
    var prueba="";
    var param1=""
    var param2="";
var respuestas;
    quitar("reply");
    quitar("thread");
    var hiloboton=document.getElementsByClassName('expandirhilo');
    for(av=0;av<hiloboton.length;av++){
        prueba=hiloboton[av].getAttribute('onclick')
        prueba=prueba.split('(')[1].replace(')',''); //parametros
        prueba=prueba.split(' ').join(''); // espacios
        prueba=prueba.split('\'').join(''); // comillas
        param1=prueba.split(',')[0];
        param2=prueba.split(',')[1];
        respuestas=document.getElementById("hidden"+hiloboton[av].parentNode.parentNode.id);
        hiloboton[av].setAttribute( "onClick", "");
        hiloboton[av].addEventListener ("click", eventofun,false);
        hiloboton[av].param1=param1;
        hiloboton[av].param2=param2;
        hiloboton[av].resp=respuestas;
    }
