// ==UserScript==
// @name         Laboratorio 4 cripto
// @namespace    https://www.example.com
// @version      1.0
// @description  Busca key's y desencripta mensaje
// @match        *
// @grant none
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/467064/Laboratorio%204%20cripto.user.js
// @updateURL https://update.greasyfork.org/scripts/467064/Laboratorio%204%20cripto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function leerPrimerCaracterMayusculaDeCadaOracion() {
        var textoPagina = document.body.innerText;

        var oraciones = textoPagina.split('.');

        var caracteresJuntos = '';

        for (var i = 0; i < oraciones.length; i++) {
            var oracion = oraciones[i].trim();

            if (oracion !== '' && oracion.length > 0) {
                caracteresJuntos += oracion.charAt(0);
            }
        }

        return caracteresJuntos
    }

    function encuentraEtiquetasDivPorFormato(key) {
        var elementosDiv = document.getElementsByTagName('div');

        var objeto = [];

        var formatoRegex = /^M\d+$/;

        for (var i = 0; i < elementosDiv.length; i++) {
            var div = elementosDiv[i];

            if (formatoRegex.test(div.classList[0])) {
                var mensajeDes = desencriptarMensaje(div.getAttribute('id'), key);
                agregarTextoAlFinalDelBody(mensajeDes)
                objeto.push(div.getAttribute('id') + ' ' + mensajeDes)
            }
        }

        return objeto
    }

    function desencriptarMensaje(mensajeCifrado, llave) {
        const formattedKey = CryptoJS.enc.Utf8.parse(llave);

        const options = {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        };

        const ciphertext = CryptoJS.enc.Base64.parse(mensajeCifrado);

        const decrypted = CryptoJS.TripleDES.decrypt({ ciphertext }, formattedKey, options);

        const mensajeDesencriptado = decrypted.toString(CryptoJS.enc.Utf8);

        return mensajeDesencriptado;
    }

    function agregarTextoAlFinalDelBody(texto) {
        var div = document.createElement("div");
        var contenido = document.createTextNode(texto);
        div.appendChild(contenido);
        document.body.appendChild(div);
    }

    function resultados(){
        const key = leerPrimerCaracterMayusculaDeCadaOracion();
        const objeto = encuentraEtiquetasDivPorFormato(key);
        console.log('La llave es: ' + key);
        console.log('Los mensajes cifrados son: ' + objeto.length);
        for (var i = 0; i < objeto.length; i++) {
            console.log(objeto[i])
        }
    }

    window.addEventListener('load', resultados());
})();