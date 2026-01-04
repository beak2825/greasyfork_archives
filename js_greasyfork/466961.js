// ==UserScript==
// @name         Laboratorio 4 cripto: 3DES
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  90% chatgpt's work
// @author       Franco Hauva
// @match        https://cripto.tiiny.site/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466961/Laboratorio%204%20cripto%3A%203DES.user.js
// @updateURL https://update.greasyfork.org/scripts/466961/Laboratorio%204%20cripto%3A%203DES.meta.js
// ==/UserScript==

(function() {
    'use strict';
    loadCryptoJS(function() {
  // CryptoJS ha sido cargado exitosamente
  // Puedes usar las funciones de CryptoJS aquí}
        decipherMessages(getKey());
        console.log(CryptoJS.MD5("Mensaje de prueba"));
    });


})();

function loadCryptoJS(callback) {
  var script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
  script.integrity = 'sha256-jjsBF/TfS+RSwLavW48KCs+dSt4j0I1V1+MSryIHd2I=';
  script.crossOrigin = 'anonymous';

  script.onload = function() {
    if (typeof callback === 'function') {
      callback();
    }
  };

  document.head.appendChild(script);
}


function decipherMessages(key){

    // Get all classes starting with M and have numbers
    var classes = $('*[class*="M"]').filter(function () {
    return this.className.match(/[M]\d+/);
    });
    console.log("Los mensajes cifrados son: " + classes.length)

    // Decipher the messages
    var keyHex = CryptoJS.enc.Utf8.parse(key);

    classes.each(function() {
        var classId = $(this).attr('id');
        // Decrypt the encrypted string
        var decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(classId)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })

        // Convert the decrypted result to a UTF-8 string
        var decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        $(this).append('<p>' + decryptedString + '</p>');
        console.log(classId , decryptedString);
      });
}

function getKey(){

      var paragraph = $('p').text();
      var sentences = paragraph.split('.')
       // Clean the sentences array from '\n'
      for (var i = 0; i < sentences.length; i++) {
        sentences[i] = sentences[i].replace('\n', '');
      }

      var key = '';

      // Iterate through the sentences array and extract the first letter of each sentence
      for (var j = 0; j < sentences.length; j++) {
        var sentence = sentences[j].trim(); // Remove leading/trailing spaces
        if (sentence.length > 0) {
          var firstLetter = sentence.charAt(0);
          key += firstLetter;
        }
      }

    console.log("La llave es:" + key)
    return key
}




