// ==UserScript==
// @name         Decrypt 3DES
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Descifrar el mensaje.
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/467329/Decrypt%203DES.user.js
// @updateURL https://update.greasyfork.org/scripts/467329/Decrypt%203DES.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js';
    script.integrity = 'sha256-6rXZCnFzbyZ685/fMsqoxxZz/QZwMnmwHg+SsNe+C/w=';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    function decrypt3DES(encryptedMessage, key) {

        // Decodificar el mensaje cifrado en base64
        const ciphertext = CryptoJS.enc.Base64.parse(encryptedMessage);

        // Convertir la clave de texto plano a formato WordArray
        const keyBytes = CryptoJS.enc.Utf8.parse(key);

        // Configurar los parámetros del algoritmo 3DES
        const options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

        // Descifrar el mensaje utilizando 3DES
        const decrypted = CryptoJS.TripleDES.decrypt(
            { ciphertext: ciphertext },
            keyBytes,
            options
        );

        // Devolver el mensaje descifrado como una cadena de texto
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    // Obtener todo el texto de la página
    const texto = document.body.innerText;

    // Dividir el texto en oraciones
    const oraciones = texto.split(/[.!?]+/);

    // Variable para almacenar los primeros caracteres
    let key = '';

    // Recorrer cada oración y obtener el primer caracter
    oraciones.forEach((oracion) => {
        const primerCar = oracion.trim().charAt(0);
        key += primerCar;
    });

    // Imprimir la key
    console.log(`La llave es: ${key}`);

    // Obtiene todos los elementos con atributo "id"
    var Ids = document.querySelectorAll('[id]');

    // Imprime el mensaje con la cantidad de elementos encontrados
    console.log("La cantidad de mensajes cifrados son: " + Ids.length);

    // muestra el valor de los atributos "id" en la consola
    Ids.forEach((Id) => {
        const mensaje = decrypt3DES(Id.id, key)
        console.log(Id.id + " " + mensaje)
        const div = document.createElement("div");
        div.textContent = mensaje;
        document.body.appendChild(div);
    });
})();
