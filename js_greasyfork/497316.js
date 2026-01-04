// ==UserScript==
// @name         Lab 4 cripto
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Identifica mensajes cifrados y los descifra
// @author       aleudp
// @match        https://lab4cripto.tiiny.site/
// @match        https://cripto.tiiny.site/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @downloadURL https://update.greasyfork.org/scripts/497316/Lab%204%20cripto.user.js
// @updateURL https://update.greasyfork.org/scripts/497316/Lab%204%20cripto.meta.js
// ==/UserScript==

(function() {
    'use strict';
//FUNCION PARA CIFRAR MENSAJE EN CASO DE QUE NO ESTE CIFRADO
    function cifrarMensaje(parrafo, llave) {
        if (document.querySelector('.M1')) {
            return;
        }

        var mensaje = parrafo.split(" ");

        var mensajeCifrado = [];

        mensaje.forEach(function(contenidoMensaje) {
            contenidoMensaje = CryptoJS.enc.Utf8.parse(contenidoMensaje);

            var cifrado = CryptoJS.TripleDES.encrypt(contenidoMensaje, CryptoJS.enc.Utf8.parse(llave), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            mensajeCifrado.push(cifrado.toString());
        });

        var i = 1;
        mensajeCifrado.forEach(function(palabra) {
            var div = document.createElement('DIV');
            div.classList.add(`M${i}`);
            div.id = palabra;
            document.body.append(div);
            i++;
        });

        return mensajeCifrado.toString();
    }


// FUNCION PARA ENCONTRAR LLAVE USANDO LAS MAYUSCULAS DENTRO DE LOS PARRAFOS
    function encontrarLlave() {
        var textElement = document.querySelector('p');

        if (!textElement) {
            return 'No se encontró el elemento de texto';
        }

        var text = textElement.textContent;
        var uppercaseChars = text.match(/[A-ZÁÉÍÓÚÜÑ]/g);
        var llave = uppercaseChars ? uppercaseChars.join('') : 'No hay mayúsculas';

        return llave;
    }

    var llave = encontrarLlave();
    console.log("La llave es:",llave);



    cifrarMensaje("Mira mamá ya soy un hacker gracias a criptografía y seguridad en redes" ,llave);

//FUNCION PARA BUSCAR LA CANTIDAD E IMPRIMIR LOS MENSAJES CIFRADOS
    function encontrarMensajesCifrados() {
        var mensajes = document.querySelectorAll('[class^="M"]');
        console.log("Los mensajes cifrados son: ", mensajes.length);

        mensajes.forEach(function(contenidoMensajes) {
            var id = contenidoMensajes.id;
            var contenidoCifrado = contenidoMensajes.textContent.trim();
            console.log(id);
        });
    }

// FUNCION PARA DESCIFRAR SÓLO EL PRIMER MENSAJE
    function descifrarPrimerMensaje() {
    var mensajes = document.querySelectorAll('[class^="M"]');
    console.log("Los mensajes cifrados son: ", mensajes.length);

    if (mensajes.length > 0) {
        var contenidoMensaje = mensajes[0];
        var id = contenidoMensaje.id;

        var mensajeDescifrado = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(id)
        }, CryptoJS.enc.Utf8.parse(llave), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);

        console.log(id + ' ' + mensajeDescifrado);
        contenidoMensaje.innerHTML = mensajeDescifrado;
    } else {
        console.log("No se encontraron mensajes para descifrar.");
    }
}


// FUNCIÓN PARA IMPRIMIR LA CANTIDAD DE MENSAJES CIFRADOS Y DESCIFRARLOS.
    function descifrarMensajes() {
        var mensajes = document.querySelectorAll('[class^="M"]');
        console.log("Los mensajes cifrados son: ", mensajes.length);
        mensajes.forEach(function(contenidoMensajes) {
            var id = contenidoMensajes.id;

            var mensajeDescifrado = CryptoJS.TripleDES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(id)
            }, CryptoJS.enc.Utf8.parse(llave), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8);

            console.log(id + ' ' + mensajeDescifrado);
            contenidoMensajes.innerHTML = mensajeDescifrado;
        });

    }
    descifrarMensajes();

})();