

    // ==UserScript==
    // @name         CryptoJS
    // @namespace    tampermonkey-example
    // @version      1.1
    // @description  Laboratorio 4 criptografia y seguridad en redes.
    // @match        https://cripto.tiiny.site/
    // @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
    // @author       AkumuKernel
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479454/CryptoJS.user.js
// @updateURL https://update.greasyfork.org/scripts/479454/CryptoJS.meta.js
    // ==/UserScript==
    (function() {
     'use strict';
     var CryptoJS = window.CryptoJS;
     // Parte 1
  
     var parrafoDiv = document.querySelector('p');
     if (!parrafoDiv) return;
  
     var textoCompleto = parrafoDiv.innerText;
     var oraciones = textoCompleto.split('. ');
     var contraseña = "";
     for (var i = 0; i < oraciones.length; i++) {
         var primeraLetra = oraciones[i].charAt(0);
         contraseña += primeraLetra;
     }
  
     if (contraseña.length > 24) {
         contraseña = contraseña.substring(0, 24);
     }
  
     console.log("La llave es:", contraseña);

     // Parte 2
     var elementos = document.querySelectorAll('div[class^="M"]');
     var ids = [];
     elementos.forEach(function(elemento) {
       ids.push(elemento.id);
   });
     var repeticiones = {};
     var patron = /\d+/;
  
     for (i = 0; i < elementos.length; i++) {
         var clases = elementos[i].classList;
         for (var j = 0; j < clases.length; j++) {
             var clase = clases[j];
             if (patron.test(clase)) {
                 if (repeticiones[clase]) {
                     repeticiones[clase]++;
                 } else {
                     repeticiones[clase] = 1;
                 }
             }
         }
     }
  
     var mensajeCifrado = "Los mensajes cifrados son: " + Object.keys(repeticiones).length;
     console.log(mensajeCifrado);
  
  
     // Parte 3
     var divs = document.getElementsByTagName('div');
     var contenidoDesencriptado = '';
     for (i = 0; i < divs.length; i++) {
         var div = divs[i];
         var id = div.id;
         var ciphertextBytes = CryptoJS.enc.Base64.parse(id);
         var decryptedBytes = CryptoJS.TripleDES.decrypt({ ciphertext: ciphertextBytes }, CryptoJS.enc.Utf8.parse(contraseña), {
             mode: CryptoJS.mode.ECB,
             padding: CryptoJS.pad.Pkcs7
         });
         var decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
         console.log(id + ": " + decryptedText);
         contenidoDesencriptado += decryptedText + ' ';
     }
  
     var palabrasDesencriptadas = contenidoDesencriptado.split(' ');
     var mensajeDesencriptado = document.createElement('p');
     for (var k = 0; k < palabrasDesencriptadas.length; k++) {
         mensajeDesencriptado.innerHTML += palabrasDesencriptadas[k] + '<br>';
     }
  
     document.body.appendChild(mensajeDesencriptado);
 })();

