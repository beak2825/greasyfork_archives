// ==UserScript==
// @name         Cripto Lab4
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Descifrar un mensaje encriptado utilizando 3DES en modo ECB en Tampermonkey
// @author       Claudio Lopez
// @match        https://cripto.tiiny.site/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiiny.site
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512=E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467047/Cripto%20Lab4.user.js
// @updateURL https://update.greasyfork.org/scripts/467047/Cripto%20Lab4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Función para descifrar un mensaje utilizando 3DES en modo ECB
  function decrypt3DES(ciphertext, key) {
    var keyHex = CryptoJS.enc.Hex.parse(key);
    var decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  // Función para ejecutar el script de descifrado
  function executeDecryptionScript() {
    // Obtener el texto cifrado desde el elemento con la clase "Parrafo"
    var ciphertextElement = document.querySelector('div.Parrafo p');
    if (ciphertextElement) {
      var ciphertext = ciphertextElement.textContent;

      // Dividir el texto en conjuntos de oraciones
      var setsOfSentences = ciphertext.split('\n\n');
      var firstSetOfSentences = setsOfSentences[0]; // Tomar solo el primer conjunto de oraciones

      // Construir la contraseña a partir del primer carácter de cada oración del primer conjunto
      var sentences = firstSetOfSentences.split('.');
      var password = '';
      for (var i = 0; i < sentences.length; i++) {
        var sentence = sentences[i].trim();
        if (sentence.length > 0) {
          password += sentence.charAt(0);
        }
      }

      // Truncar la contraseña a 24 bytes
      if (password.length > 24) {
        password = password.substring(0, 24);
      }

      // Mostrar la contraseña en la consola
      console.log('La llave es:', password);
    } else {
      console.log("No se encontró el elemento con la clase 'Parrafo'.");
    }

    // Obtener los elementos div con las id
    var divElements = document.querySelectorAll('div[class^="M"]');
    // Mostrar la cantidad de mensajes cifrados
    console.log('Los mensajes cifrados son:', divElements.length);

    // Descifrar cada mensaje
    divElements.forEach(function(element) {
      var ciphertext = element.id;
      var key = password;
      // Convertir el ciphertext a un objeto WordArray
      var ciphertextBytes = CryptoJS.enc.Base64.parse(ciphertext);

      // Descifrar utilizando 3DES en modo ECB
      var decryptedBytes = CryptoJS.TripleDES.decrypt(
        { ciphertext: ciphertextBytes },
        CryptoJS.enc.Utf8.parse(key),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      // Convertir los bytes descifrados a texto
      var decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

      // Mostrar el mensaje descifrado en el sitio web
      element.textContent = decryptedText;

      // Mostrar el mensaje descifrado en la consola
      console.log(ciphertext + ' ', decryptedText);
    });
  }

  // Utilizar MutationObserver para detectar cambios en el texto
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'characterData') {
        executeDecryptionScript();
      }
    });
  });

  // Configurar el MutationObserver para observar cambios en el texto
  var config = { characterData: true, subtree: true };
  observer.observe(document.body, config);

  // Ejecutar el script de descifrado por primera vez
  executeDecryptionScript();
})();
