// ==UserScript==
// @name         CryptoJS
// @namespace    tampermonkey-example
// @version      1.0
// @description  Laboratorio 4 criptografía y seguridad en redes.
// @author       Benjamin Escandar
// @match        https://cripto.tiiny.site/
// @match        https://analytics.tiiny.site/js/plausible.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497580/CryptoJS.user.js
// @updateURL https://update.greasyfork.org/scripts/497580/CryptoJS.meta.js
// ==/UserScript==

(function() {
 'use strict';
 var CryptoJS = window.CryptoJS;

 // Parte 1: Obtener la llave
 var parrafoDiv = document.querySelector('p');
 if (!parrafoDiv) return; // Si no se encuentra el párrafo, se detiene la ejecución.

 var textoCompleto = parrafoDiv.innerText;
 var oraciones = textoCompleto.split('. '); // Dividir el texto en oraciones.
 var contraseña = "";
 for (var i = 0; i < oraciones.length; i++) {
     var primeraLetra = oraciones[i].charAt(0); // Obtener la primera letra de cada oración.
     contraseña += primeraLetra; // Construir la contraseña usando las primeras letras de cada oración.
 }

 if (contraseña.length > 24) {
     contraseña = contraseña.substring(0, 24); // Limitar la contraseña a 24 caracteres.
 }
 console.log(`La llave es: ${contraseña}`);
    

 // Parte 2: Contar los mensajes cifrados
 var mensajesCifrados = document.querySelectorAll('div[class^="M"]');  // Esto asume que los mensajes tienen clases que empiezan con "M"
 console.log(`Los mensajes cifrados son: ${mensajesCifrados.length}`);


 // Parte 3: Descifrar cada mensaje y mostrarlo
 var divs = document.querySelectorAll('div[class^="M"]');
 var contenidoDesencriptado = '';

 divs.forEach((div) => {
     var id = div.id;
     var ciphertextBytes = CryptoJS.enc.Base64.parse(id); // Convertir el texto cifrado de Base64 a bytes.
     var decryptedBytes = CryptoJS.TripleDES.decrypt({ ciphertext: ciphertextBytes }, CryptoJS.enc.Utf8.parse(contraseña), {
         mode: CryptoJS.mode.ECB, // Modo de cifrado: Electronic Codebook (ECB).
         padding: CryptoJS.pad.Pkcs7 // Tipo de relleno: PKCS #7.
     });
     var decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8); // Convertir los bytes descifrados a texto.
     console.log(id + ": " + decryptedText); // Mostrar el ID del mensaje y el texto descifrado en la consola.
     contenidoDesencriptado += decryptedText + ' '; // Agregar el texto descifrado al contenido desencriptado.
 });

 var palabrasDesencriptadas = contenidoDesencriptado.split(' '); // Dividir el contenido desencriptado en palabras.
 var mensajeDesencriptado = document.createElement('p');
 palabrasDesencriptadas.forEach((palabra) => {
     mensajeDesencriptado.innerHTML += palabra + '<br>'; // Crear un párrafo HTML con las palabras desencriptadas.
 });

 document.body.appendChild(mensajeDesencriptado); // Agregar el párrafo al cuerpo del documento HTML.
})();
