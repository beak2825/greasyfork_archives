// ==UserScript==
// @name         Lab 4
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  lab 4
// @author       Felipe Leyton
// @match        https://cripto.tiiny.site/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497478/Lab%204.user.js
// @updateURL https://update.greasyfork.org/scripts/497478/Lab%204.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Agregar la librería CryptoJS con SRI al documento HTML
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    script.integrity = 'sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    script.onload = function(){
    // Parte 1: Obtener la llave
    var bodyText = document.body.innerText;

    function buscarClave(texto) {
        var key = '';
        var sentences = texto.split('.');
        sentences.forEach(function(sentence) {
            var trimmedSentence = sentence.trim();
            if (trimmedSentence.length > 0) {
                key += trimmedSentence.charAt(0);
            }
        });
        return key;
    }

    var key = buscarClave(bodyText);

    if (key) {
        console.log('La llave es: ' + key);
    } else {
        console.log('No se encontró la llave oculta.');
        return;
    }

    // Parte 2: Detectar la cantidad de mensajes cifrados
    let mensajesCifrados = document.querySelectorAll('[class^="M"]');

    console.log('Los mensajes cifrados son: ' + mensajesCifrados.length);

    // Parte 3: Obtener cada mensaje cifrado y descifrarlo
    mensajesCifrados.forEach((mensajeCifrado) => {
        let mensajeCifradoBase64 = mensajeCifrado.id;
        let mensajeCifradoBytes =
            CryptoJS.enc.Base64.parse(mensajeCifradoBase64);
        let mensajeDescifradoBytes = CryptoJS.TripleDES.decrypt(
            { ciphertext: mensajeCifradoBytes },
            CryptoJS.enc.Utf8.parse(key),
            { mode: CryptoJS.mode.ECB }
        );
        let mensajeDescifrado = mensajeDescifradoBytes.toString(
           CryptoJS.enc.Utf8
        );
        console.log(mensajeCifradoBase64 + " " + mensajeDescifrado);
        mensajeCifrado.innerText = mensajeDescifrado;
    });
    }
})();