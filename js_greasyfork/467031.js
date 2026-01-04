// ==UserScript==
// @name         Laboratorio-4
// @version      1
// @description  Script utilizado para resolver el laboratorio 4, de la clase Criptografia, Universidad Diego Portales.
// @author       MarcosValderrama
// @match        *://cripto.tiiny.site
// @license MIT
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#md5=2ca03ad87885ab983541092b87adb299
// @namespace https://greasyfork.org/users/1084169
// @downloadURL https://update.greasyfork.org/scripts/467031/Laboratorio-4.user.js
// @updateURL https://update.greasyfork.org/scripts/467031/Laboratorio-4.meta.js
// ==/UserScript==


//-- Parte 1

var content = jQuery('.Parrafo').text();

var sentence = content.split('\n');

var key = ''
for(var i = 0; i< sentence.length; i += 1){
   if(sentence[i] != ''){
      key = key.concat(sentence[i].charAt(0))
   }
}

console.log('La llave es: ', key );

//-- Parte 2

var msg = jQuery('[class^=M]').map(function(){return $(this).attr("id");}).get();

console.log('Los mensajes cifrados son: ', msg.length)

//-- Parte 3

var decrypted = ''
var utf8_key = CryptoJS.enc.Utf8.parse(key);

var replace = 'Mensaje: '

for(var j = 0; j < msg.length; j += 1){
   //console.log(msg[j])
   decrypted = CryptoJS.TripleDES.decrypt(msg[j].toString(),utf8_key, {mode: CryptoJS.mode.ECB});
   console.log(msg[j],decrypted.toString(CryptoJS.enc.Utf8))
   replace = replace.concat(decrypted.toString(CryptoJS.enc.Utf8), ' ')
}

jQuery('.Parrafo').text(jQuery('.Parrafo').text().replace(jQuery('.Parrafo').text(), replace))
