// ==UserScript==
// @name         Extraer Llave y Desencriptar Mensajes
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Extrae la llave de los párrafos, cuenta y desencripta mensajes cifrados en cripto.tiiny.site
// @author       Saircor
// @match        https://cripto.tiiny.site/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497392/Extraer%20Llave%20y%20Desencriptar%20Mensajes.user.js
// @updateURL https://update.greasyfork.org/scripts/497392/Extraer%20Llave%20y%20Desencriptar%20Mensajes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cargar CryptoJS manualmente
    function loadScript(url, callback) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js", function() {
        //console.log("CryptoJS loaded");

        // Función para extraer la clave de los párrafos
        function obtenerClave() {
            let clave = '';
            const parrafos = document.querySelectorAll('p');
            parrafos.forEach(parrafo => {
                const texto = parrafo.innerText;
                for (let i = 0; i < texto.length; i++) {
                    if (texto[i] === texto[i].toUpperCase() && /[A-Z]/.test(texto[i])) {
                        clave += texto[i];
                    }
                }
            });
            return clave;
        }

        // Función para contar los mensajes cifrados en los divs y guardar sus IDs
        function obtenerMensajesCifrados() {
            const divs = document.querySelectorAll('div');
            let idsCifrados = [];
            divs.forEach(div => {
                if (div.id && /^[A-Za-z0-9+/=]+$/.test(div.id)) {
                    idsCifrados.push(div.id);
                }
            });
            return idsCifrados;
        }

        // Función para desencriptar los mensajes usando 3DES
        function desencriptarMensaje(mensajeCifrado, clave) {
            try {
                const keyHex = CryptoJS.enc.Utf8.parse(clave);
                const encryptedBytes = CryptoJS.enc.Base64.parse(mensajeCifrado);
                const decrypted = CryptoJS.TripleDES.decrypt(
                    {
                        ciphertext: encryptedBytes
                    },
                    keyHex,
                    {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    }
                );
                return decrypted.toString(CryptoJS.enc.Utf8);
            } catch (e) {
                console.error('Error al desencriptar el mensaje:', e);
                return null;
            }
        }

        // Función principal
        function principal() {
            // Obtener la clave de los párrafos
            const clave = obtenerClave();
            console.log("La llave es: " + clave);

            // Obtener los mensajes cifrados en los divs
            const idsMensajesCifrados = obtenerMensajesCifrados();
            console.log("Cantidad de mensajes cifrados: " + idsMensajesCifrados.length);
            //console.log("IDs de los mensajes cifrados: ", idsMensajesCifrados);

            // Desencriptar y mostrar los mensajes
            idsMensajesCifrados.forEach(mensajeCifrado => {
                const mensajeDesencriptado = desencriptarMensaje(mensajeCifrado, clave);
                if (mensajeDesencriptado) {
                    console.log(`${mensajeCifrado} ${mensajeDesencriptado}`);

                    // Crear un nuevo elemento para mostrar el mensaje desencriptado en la página
                    const divMensaje = document.createElement('div');
                    divMensaje.innerText = ` ${mensajeDesencriptado}`;
                    document.body.appendChild(divMensaje);
                } else {
                    console.error(`No se pudo desencriptar el mensaje: ${mensajeCifrado}`);
                }
            });
        }

        // Ejecutar la función principal después de que la página se haya cargado
        window.addEventListener('load', principal);
    });
})();