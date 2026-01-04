// ==UserScript==
// @name         Key cripto lab04
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  Descifrar mediante 3DES
// @author       Franco Ramirez
// @match        https://*.tiiny.site/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha384-mgWScxWVKP8F7PBbpNp7i/aSb17kN0LcifBpahAplF3Mn0GR4/u1oMpWIm2rD8yY
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497856/Key%20cripto%20lab04.user.js
// @updateURL https://update.greasyfork.org/scripts/497856/Key%20cripto%20lab04.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function decryptMessage(encryptedMessage, key) {
        // Convertir la clave en un formato adecuado
        const keyHex = CryptoJS.enc.Utf8.parse(key);

        // Descifrar el mensaje
        const decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(encryptedMessage)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        // Convertir el mensaje descifrado a texto
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        return decryptedText;
    }

    function getKey(){

        // Se obtiene el texto completo
        const bodyText = document.body.innerText;

        // Trae todas las mayusculas y las concatena
        const key = bodyText.match(/[A-Z]/g).join('');

        // Retorna la llave encontrada
        return key;
    }

    function getMsgs(){

        const divs = document.querySelectorAll('div');
        const pattern = /^M\d+$/;

        const filteredDivs = Array.from(divs).filter(div => pattern.test(div.className));

        return filteredDivs;

    }


    window.addEventListener('load', function() {

        var messages_enc = [];
        var messages_dec = [];

        const key = getKey();

        const divs = getMsgs();

        console.log('La llave es:', key);

        console.log("Los mensajes cifrados son:", divs.length);


        divs.forEach((div) => {
            const dec = decryptMessage(div.id, key);
            messages_enc.push(div.id);
            messages_dec.push(dec);
        });


        for(let i = 0; i < messages_enc.length; i++){
            console.log(`M${i+1}: `, messages_enc[i], messages_dec[i]);
            const p = document.createElement('p');
            p.textContent = messages_dec[i];
            divs[i].appendChild(p);
        }
    });
})();