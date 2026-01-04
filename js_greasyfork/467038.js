// ==UserScript==
// @name         Laboratorio 4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Desarrollo laboratorio 4
// @author       vania
// @match        https://cripto.tiiny.site/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT 
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js#sha256-6rXZCnFzbyZ685/fMsqoxxZz/QZwMnmwHg+SsNe+C/w=
// @downloadURL https://update.greasyfork.org/scripts/467038/Laboratorio%204.user.js
// @updateURL https://update.greasyfork.org/scripts/467038/Laboratorio%204.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtener todos los elementos con la clase "Parrafo"
    var parrafos = document.getElementsByClassName("Parrafo");

    // Crear una variable para almacenar la contraseña
    var contraseña = "";

    // Recorrer los elementos y obtener el primer carácter de cada oración
    for (var i = 0; i < parrafos.length; i++) {
        var parrafo = parrafos[i];
        var oraciones = parrafo.textContent.trim().split(".");
        for (var j = 0; j < oraciones.length; j++) {
            var oracion = oraciones[j].trim();
            if (oracion.length > 0) {
                var primerCaracter = oracion.charAt(0);
                contraseña += primerCaracter;
            }
        }
    }

    // Asegurarse de que la contraseña tenga exactamente 24 bytes
    if (contraseña.length < 24) {
        while (contraseña.length < 24) {
            contraseña += contraseña;  // Concatenar la propia contraseña para llenar el espacio restante
        }
    } else if (contraseña.length > 24) {
        contraseña = contraseña.slice(0, 24);  // Truncar la contraseña a 24 bytes
    }

    // Imprimir la contraseña en la consola
    console.log("La llave es: " + contraseña);

    const classes = document.querySelectorAll('*[class]');

    // Obtener todos los elementos div que tienen una clase con la estructura "M+N"
    const regexClass = /^M\d+$/;
    const matchedDivs = Array.from(classes).filter((element) => regexClass.test(element.className));

    console.log(`Los mensajes cifrados son: ${matchedDivs.length}`);

    // Función para descifrar el contenido cifrado de un ID
    function desencriptar3DES(mensajeCifrado, clave) {
        // Convertir la clave a un objeto WordArray
        var claveWordArray = CryptoJS.enc.Utf8.parse(clave);

        // Convertir el mensaje cifrado a un objeto WordArray
        var mensajeCifradoWordArray = CryptoJS.enc.Base64.parse(mensajeCifrado);

        // Desencriptar el mensaje utilizando 3DES en modo ECB
        var mensajeDesencriptado = CryptoJS.TripleDES.decrypt({
            ciphertext: mensajeCifradoWordArray
        }, claveWordArray, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        // Convertir el mensaje desencriptado a una cadena de texto
        var mensajeDesencriptadoTexto = mensajeDesencriptado.toString(CryptoJS.enc.Utf8);

        // Devolver el mensaje desencriptado
        return mensajeDesencriptadoTexto;
    }

    // Descifrar cada ID cifrado y mostrar el texto cifrado y descifrado en la consola
    matchedDivs.forEach((div) => {
        var encryptedID = div.id;
        var decryptedID = desencriptar3DES(encryptedID, contraseña);
        console.log(`${encryptedID} ${decryptedID}`);
        div.innerText = decryptedID
    });

})();