// ==UserScript==
// @name         super decifrador
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  script desarrollado para el laboratoroio numero 4 del ramo "cripografia y seguridad en redes"
// @author       Javiera Manzo Gonzalez
// @match        https://cripto.tiiny.site/
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @grant        none
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467067/super%20decifrador.user.js
// @updateURL https://update.greasyfork.org/scripts/467067/super%20decifrador.meta.js
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
        //funcion decrypt
    function desencriptarArreglo(arregloEncriptado, llave) {
        // Convertir la llave en un objeto WordArray
        var llaveWordArray = CryptoJS.enc.Hex.parse(llave);

        // Configurar opciones de triple DES en modo ECB
        var opciones = {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        };

        // Desencriptar cada elemento del arreglo
        var arregloDesencriptado = arregloEncriptado.map(function(encriptado) {
            var encriptadoWordArray = CryptoJS.enc.Base64.parse(encriptado);
            var desencriptadoWordArray = CryptoJS.TripleDES.decrypt({
                ciphertext: encriptadoWordArray
            }, llaveWordArray, opciones);
            var desencriptadoUtf8 = CryptoJS.enc.Utf8.stringify(desencriptadoWordArray);
            return desencriptadoUtf8;
        });

        return arregloDesencriptado;
    }

    // Mostrar la cantidad de mensajes identificados y los mensajes encriptados
    console.log('Cantidad de mensajes identificados:', mensajesIdentificados);
    console.log('Mensajes encriptados:', mensajesEncriptados);
       // Desencriptar el arreglo y mostrar el resultado en la consola
    var resultadoDesencriptado = desencriptarArreglo(mensajesEncriptados, palabraJuntada);
    console.log(resultadoDesencriptado);

})();