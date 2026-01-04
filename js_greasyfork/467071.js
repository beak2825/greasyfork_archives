

    // ==UserScript==
    // @name         1.111
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  script desarrollado para el laboratoroio numero 4 del ramo "cripografia y seguridad en redes"
    // @author       Javiera Manzo Gonzalez
    // @match        https://cripto.tiiny.site/
    // @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
    // @grant        none
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467071/1111.user.js
// @updateURL https://update.greasyfork.org/scripts/467071/1111.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

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

        console.log("La llave es:", palabraJuntada);

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

        var CryptoJS = window.CryptoJS;
        //funcion decrypt
        function tripleDESdd(text,llave){
            var llaveHex = CryptoJS.enc.Hex.parse(llave);
            var decrypted = CryptoJS.TripleDES.decrypt(text, llaveHex,{
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Uft8);
        }

       


        // Mostrar la cantidad de mensajes identificados y los mensajes encriptados
        console.log('Cantidad de mensajes identificados:', mensajesIdentificados);
        console.log('Mensajes encriptados:', mensajesEncriptados);
           // Desencriptar el arreglo y mostrar el resultado en la consola
        //var resultadoDesencriptado = desencriptarArreglo(mensajesEncriptados, palabraJuntada);
        //console.log(resultadoDesencriptado);
        for (let i=0 ; i < mensajesEncriptados.length ;i++){
            var mensaje = mensajesEncriptados[i];
            var AA = CryptoJS.enc.Base64.parse(mensaje);
            var BB = CryptoJS.TripleDES.decrypt({ text : AA}, CryptoJS.enc.Utf8.parse(palabraJuntada),{
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            var CC= BB.toString(CryptoJS.enc.Utf8);
            console.log(mensaje + ": " +CC);

        }
    })();

