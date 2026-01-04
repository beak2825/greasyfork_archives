// ==UserScript==
// @name     hcistorico hangouts 
// @namespace	https://hangouts.google.com/webchat/
// @include		https://hangouts.google.com/webchat/*
// @version  1
// @description:es script para el chat hcistorico en hangouts
// @grant    none
// @description script para el chat hcistorico en hangouts
// @downloadURL https://update.greasyfork.org/scripts/38690/hcistorico%20hangouts.user.js
// @updateURL https://update.greasyfork.org/scripts/38690/hcistorico%20hangouts.meta.js
// ==/UserScript==


//importando jquery para empezar
//var script = document.createElement('script');
//script.src = 'https://code.jquery.com/jquery-1.11.0.min.js';
//script.type = 'text/javascript';
//document.getElementsByTagName('head')[0].appendChild(script);

  
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setWidth(clase, valor) {
    elements = document.getElementsByClassName(clase);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.width=valor;
    }
}

function setHidden(clase) {
    elements = document.getElementsByClassName(clase);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display="none";
    }
}

async function main() {
  
  //cambios iniciales
  this.resizeTo(500, 700);
  
  //Cambios iterativos cada 1 segundos
  while (1){
  	await sleep(1000);

    //Cambio el ancho de los bocadillos para que sea el 100%
		setWidth("Tn", "100%");
		setWidth("KL", "100%");
    
    //Escondo el nombre y el X minutos de debajo
    setHidden("TlvAYc");

  }
}

main();




