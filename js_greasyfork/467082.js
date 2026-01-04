// ==UserScript==
// @name         Lab 4 TripleDES
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  script desarrollado para el laboratorio numero 4 del ramo "criptografía y seguridad en redes"
// @author       Javiera Manzo Gonzalez
// @match        https://cripto.tiiny.site/
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @license      javi
// @downloadURL https://update.greasyfork.org/scripts/467082/Lab%204%20TripleDES.user.js
// @updateURL https://update.greasyfork.org/scripts/467082/Lab%204%20TripleDES.meta.js
// ==/UserScript==

    (function() {
        'use strict';
        var CryptoJS = window.CryptoJS;

        function juntarLetras(texto) {
            // Separar el texto en oraciones utilizando el punto como separador
            var oraciones = texto.split('.');
            var llavesita = "";

            // Recorrer cada oración
            for (var i = 0; i < oraciones.length; i++) {
                var oracion = oraciones[i].trim();
                if (oracion !== "") {
                    // Obtener la primera letra de la oración
                    var primeraLetra = oracion.charAt(0);
                    // Agregar la primera letra a la palabra
                    llavesita += primeraLetra;
                }
            }

            // Devolver la palabra resultante
            return llavesita;
        }
        // Obtener el texto de la página
        var textoPagina = document.body.innerText;

        // Juntar la primera letra de cada oración en el texto
        var palabraJuntada = juntarLetras(textoPagina);

        console.log("La llave es:",palabraJuntada);

        // Obtener todos los elementos "div" en la página
        const divs = document.getElementsByTagName('div');

        let mensajesIdentificados = 0;
        let mensajesEncriptados = [];
        for (let i = 0; i < divs.length; i++) {
            const id = divs[i].getAttribute('id');

            if (id) {
                mensajesIdentificados++;
                mensajesEncriptados.push(id);
            }
        }

        function desencriptarTripleDES(ciphertext, clave) {
  // Convertir la clave a un objeto WordArray
            var key = CryptoJS.enc.Utf8.parse(clave);

  // Decodificar el texto cifrado de base64 a un objeto WordArray
            var ciphertextDecoded = CryptoJS.enc.Base64.parse(ciphertext);

  // Definir opciones de desencriptación
            var options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

  // Desencriptar el texto cifrado utilizando TripleDES y la clave
            var decrypted = CryptoJS.TripleDES.decrypt({ ciphertext: ciphertextDecoded }, key, options);

  // Retornar el texto desencriptado como una cadena UTF-8
            return decrypted.toString(CryptoJS.enc.Utf8);
        }

        console.log('Cantidad de mensajes identificados:', mensajesIdentificados);

        var frase= '';
        for (let i=0 ; i < mensajesEncriptados.length ;i++){

            var text= mensajesEncriptados[i];
            //console.log(text);
            var clave= palabraJuntada;
            var resultado = desencriptarTripleDES(text, clave);
            console.log(text+ ": " +resultado);

                frase=frase+resultado+' ';



        }
        console.log(frase);

    var mensajeElemento = document.createElement("p");
    mensajeElemento.innerText = frase;

    document.body.appendChild(mensajeElemento);
    })();

