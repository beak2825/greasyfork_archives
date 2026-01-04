// ==UserScript==
// @name         Lab 4 Cripto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  el coso del cosito
// @author       Daniel Salas
// @match        *://cripto.tiiny.site/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @downloadURL https://update.greasyfork.org/scripts/467187/Lab%204%20Cripto.user.js
// @updateURL https://update.greasyfork.org/scripts/467187/Lab%204%20Cripto.meta.js
// ==/UserScript==

//Parte 1
$(document).ready(function() {
    //filtra por Parrafo
    var divElements = $("div.Parrafo");
    var key = "";
    divElements.each(function() {
      divElements.each(function() {
        var paragraph = $(this).text().trim();
        var sentences = paragraph.split(".");
        for (var i = 0; i < sentences.length; i++) {
          var sentence = sentences[i].trim();
          if (sentence !== "") {
            //extrae y agrega los primeros chars
            var firstChar = sentence.charAt(0);
            key += firstChar;
          }
        }
      });
    });

    //imprime la key
    console.log("La llave es: " + key);

     //Parte 2

    //encontrar los elementos con clase "M#"
    var hiddenMessages = jQuery('[ class ^=M]').map( function(){return $( this ).attr("id");}).get();
    console.log("Los mensajes cifrados son: " + hiddenMessages.length)

    // Parte 3
    var decrypted = '';
    var encoded_key = CryptoJS.enc.Utf8.parse(key);

    for(var j = 0; j < hiddenMessages.length; j += 1){
        decrypted = CryptoJS.TripleDES.decrypt(hiddenMessages[j].toString(), encoded_key, {
            mode: CryptoJS.mode.ECB
    });
    console.log(hiddenMessages[j], decrypted.toString(CryptoJS.enc.Utf8))

    //agregar el texto a la pag
    var decryptedText = document.createElement('p');
    decryptedText.style.color = 'red';
    decryptedText.textContent = decrypted.toString(CryptoJS.enc.Utf8);
    var messageDiv = $('div.M'+[j+1]);
    messageDiv.append(decryptedText);
    }
});
