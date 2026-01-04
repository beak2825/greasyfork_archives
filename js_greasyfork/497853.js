// ==UserScript==
// @name         Obtener llave y descifrar los mensajes ocultos de la página web.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Laboratorio 4 de criptografía y seguridad en redes. Se obtiene la llave y se descifran los mensajes utilizando el algoritmo de cifrado 3DES.
// @author       Coke
// @match        https://cripto.tiiny.site/
// @match        http://127.0.0.1:5500/index.html
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js#sha512-nOQuvD9nKirvxDdvQ9OMqe2dgapbPB7vYAMrzJihw5m+aNcf0dX53m6YxM4LgA9u8e9eg9QX+/+mPu8kCNpV2A==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497853/Obtener%20llave%20y%20descifrar%20los%20mensajes%20ocultos%20de%20la%20p%C3%A1gina%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/497853/Obtener%20llave%20y%20descifrar%20los%20mensajes%20ocultos%20de%20la%20p%C3%A1gina%20web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Esperar un poco para asegurarse de que el script de live-server haya inyectado el código
    setTimeout(function() {
        // Obtener el párrafo en el body de la página
        const paragraph = document.querySelector('body').querySelector('p');
        if (!paragraph) {
            console.error('No se encontró ningún párrafo en la página.');
            return;
        }

        //Extraer el texto
        const paragraphText = paragraph.innerText;

        //Obtener las letras mayúsculas del texto y concatenar cada una de ellas para crear y obtener la llave
        const key = (paragraphText.match(/[A-Z]/g) || []).join('');
        if (key.length === 0) {
            console.error('No se encontraron letras mayúsculas');
            return;
        }
        //Llave obtenida
        console.log('La llave es:', key);

        //Descifrado 3DES
        function decrypt3DES(ciphertext, key) {
            try {
                const keyHex = CryptoJS.enc.Utf8.parse(key);
                const decrypted = CryptoJS.TripleDES.decrypt({
                    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
                }, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return CryptoJS.enc.Utf8.stringify(decrypted);
            } catch (error) {
                console.error('Error al descifrar el mensaje:', error);
                return null;
            }
        }

        function ObtenerMensajesCifrados() {
            //Obtener todos los elementos que pertenecen a la clase M
            const messageElements = document.querySelectorAll('div[class^="M"]');
            const messageIds = Array.from(messageElements)
                .filter(el => el.id)  // Asegurarse de que el elemento tenga un atributo id
                .map(el => el.id);

            //Mostrar la cantidad de mensajes cifrados
            console.log(`Los mensajes cifrados son: ${messageIds.length}`);

            //Contenedor para los mensajes descifrados
            const decryptedContainer = document.createElement('div');
            decryptedContainer.id = 'decrypted-messages';
            document.body.appendChild(decryptedContainer);

            //Descifrar cada mensaje y mostrarlo en la consola y en la página
            messageIds.forEach(id => {
                const element = document.getElementById(id);
                if (!element) {
                    console.error(`No se encontró el mensaje con el ID: ${id}`);
                    return;
                }

                const ciphertext = element.id;
                const decryptedMessage = decrypt3DES(ciphertext, key);
                if (decryptedMessage) {
                    console.log(`${id} ${decryptedMessage}`);
                    const messageElement = document.createElement('p');
                    messageElement.innerText = `${decryptedMessage}`;
                    messageElement.style.marginTop = '0'; //Eliminar el margen superior
                    messageElement.style.marginBottom = '0'; //Eliminar el margen inferior
                    decryptedContainer.appendChild(messageElement);
                } else {
                    console.error(`No se pudo descifrar el mensaje ${id}`);
                }
            });
        }

        //Llamar a la función para obtener automáticamente los mensajes cifrados
        ObtenerMensajesCifrados();

       //Cifrado 3DES
       function encrypt3DES(message, key) {
           try {
               //Convertir la clave a un formato que pueda ser utilizado por CryptoJS
               const keyHex = CryptoJS.enc.Utf8.parse(key);

               //Cifrar el mensaje utilizando 3DES
               const encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
                   mode: CryptoJS.mode.ECB,
                   padding: CryptoJS.pad.Pkcs7
               });

        //Devolver el mensaje cifrado en formato Base64
        return encrypted.toString();
    } catch (error) {
        console.error('Error al cifrar el mensaje:', error);
        return null;
    }

}
       //Llamar a la función para cifrar los mensajes
        //const mensajeCifrado = encrypt3DES("mensaje", "CLAVESECRETACLAVESECRETA");

      //Imprime el mensaje cifrado
       //console.log(mensajeCifrado);

    }, 1000); //Esperar 1 segundo después de la carga de la página
})();