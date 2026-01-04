// ==UserScript==
// @name        Lab Cripto Cristobal Romero
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Laboratorio 4 Criptografía
// @author      You
// @match       https://cripto.tiiny.site
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497475/Lab%20Cripto%20Cristobal%20Romero.user.js
// @updateURL https://update.greasyfork.org/scripts/497475/Lab%20Cripto%20Cristobal%20Romero.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    //script.integrity = 'sha512-INVALID_HASH_VALUE';
    script.integrity = 'sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    script.onload = function () {
        // Parte 1: Obtener la llave
        const parrafo = document.querySelector("p").innerText;
        const oraciones = parrafo.split(". ");
        let llave = "";

        for (let i = 0; i < oraciones.length; i++) {
            llave += oraciones[i].charAt(0);
        }

        console.log("La llave es: " + llave);


        // Parte 2: Identificar la cantidad de mensajes cifrados
        let mensajesCifrados = document.querySelectorAll('div[class^="M"]');
        console.log("Los mensajes cifrados son: " + mensajesCifrados.length);

        mensajesCifrados.forEach((mensajeCifrado) => {
            let mensajeCifradoBase64 = mensajeCifrado.id;
            let mensajeCifradoBytes = CryptoJS.enc.Base64.parse(mensajeCifradoBase64);
            let mensajeDescifradoBytes = CryptoJS.TripleDES.decrypt(
                { ciphertext: mensajeCifradoBytes },
                CryptoJS.enc.Utf8.parse(llave),
                { mode: CryptoJS.mode.ECB }
            );
            let mensajeDescifrado = mensajeDescifradoBytes.toString(CryptoJS.enc.Utf8);
            console.log(mensajeCifradoBase64 + " " + mensajeDescifrado);
            mensajeCifrado.innerText = mensajeDescifrado;
        });
    };
})();