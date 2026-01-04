// ==UserScript==
// @name         CryptoJS
// @namespace    tampermonkey-example
// @version      1.0
// @description  Laboratorio 4 criptografia y seguridad en redes.
// @match        https://cripto.tiiny.site/
// @match        http://127.0.0.1:5500/xd.html
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @author       pablo saez
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467051/CryptoJS.user.js
// @updateURL https://update.greasyfork.org/scripts/467051/CryptoJS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var CryptoJS = window.CryptoJS;
    // Función para descifrar utilizando 3DES ECB
    function decrypt3DES(ciphertext, key) {
        var keyHex = CryptoJS.enc.Hex.parse(key);
        var decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    var parrafoDiv = document.querySelector('.Parrafo');
    if (!parrafoDiv) return;

    var textoCompleto = parrafoDiv.innerText;
    var oraciones = textoCompleto.split('. ');
    var contraseña = "";
    for (var i = 0; i < oraciones.length; i++) {
        var primeraLetra = oraciones[i].charAt(0);
        contraseña += primeraLetra;
    }

    if (contraseña.length > 24) {
        contraseña = contraseña.substring(0, 24);
    }

    console.log("La llave es:", contraseña);

    var elementos = document.querySelectorAll('[class]');
    var ids = document.querySelectorAll('[id]');
    var repeticiones = {};
    var patron = /\d+/;

    for (i = 0; i < elementos.length; i++) {
        var clases = elementos[i].classList;
        for (var j = 0; j < clases.length; j++) {
            var clase = clases[j];
            if (patron.test(clase)) {
                if (repeticiones[clase]) {
                    repeticiones[clase]++;
                } else {
                    repeticiones[clase] = 1;
                }
            }
        }
    }

    var mensajeCifrado = "Los mensajes cifrados son: " + Object.keys(repeticiones).length;
    console.log(mensajeCifrado);

    var divs = document.getElementsByTagName('div');
    var contenidoDesencriptado = '';
    for (i = 1; i < divs.length; i++) {
        var div = divs[i];
        var id = div.id;
        var ciphertextBytes = CryptoJS.enc.Base64.parse(id);
        var decryptedBytes = CryptoJS.TripleDES.decrypt({ ciphertext: ciphertextBytes }, CryptoJS.enc.Utf8.parse(contraseña), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log(id + ": " + decryptedText);
        contenidoDesencriptado += decryptedText + ' ';
    }

    var palabrasDesencriptadas = contenidoDesencriptado.split(' ');
    var mensajeDesencriptado = document.createElement('p');
    for (var k = 0; k < palabrasDesencriptadas.length; k++) {
        mensajeDesencriptado.innerHTML += palabrasDesencriptadas[k] + '<br>';
    }

    document.body.appendChild(mensajeDesencriptado);
})();
