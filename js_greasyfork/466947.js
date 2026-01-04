// ==UserScript==
// @name         Lab 4 cripto
// @namespace    tampermonkey-plugin
// @version      1.2
// @description  Script para laboratorio 4 de criptologia y seguridad en redes, cifrado simetrico
// @match        *.tiiny.site
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js#sha384-0DrKBsfUuJe/vqjia1HviapRn4mR1BYfCpQ9gT7qjSKu8TrzTe2tlbK3cI9i9EwV
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466947/Lab%204%20cripto.user.js
// @updateURL https://update.greasyfork.org/scripts/466947/Lab%204%20cripto.meta.js
// ==/UserScript==

(function() {
  var text = ''; // Variable para almacenar el texto de la página
  var previousText = ''; // Variable para almacenar el texto anterior
  var result = '';
  var c = 0;

  function processText() {
    if(c==0){
        // Obtener el texto de la página
        text = document.body.innerText;

        // Verificar si el texto es igual al anterior
        if (text === previousText) {
            return; // Finalizar si el texto se repite
        }

        // Dividir el texto en oraciones
        var sentences = text.split(/[.!?]/);

        // Concatenar el primer carácter de cada oración
        //var result = '';
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i].trim();
            if (sentence.length > 0) {
                result += sentence.charAt(0);
            }
        }

        // Mostrar el resultado
        console.log("La llave es:", result);

        // Almacenar el texto actual como el anterior
        previousText = text;

        // Esperar un tiempo y procesar el texto nuevamente
        setTimeout(processText, 1000);
        c += 1;
    }
  }
  function processDiv(){
      var k = 0;
      var divElements = document.getElementsByTagName("div");
      for (var j = 0; j < divElements.length; j++) {
          if(divElements[j].getAttribute("id")){
              k += 1;
          }
      }
      console.log("Los mensajes cifrados son:", k);
      for (var i = 0; i < divElements.length; i++) {
          var id = divElements[i].getAttribute("id");
          if(id){
              var key = CryptoJS.enc.Utf8.parse(result.substr(0, 24));
              var data = id;
              var decrypted = CryptoJS.TripleDES.decrypt(data, key, {mode: CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8);
              console.log(id, decrypted);
              document.getElementById(id).innerHTML += decrypted;
          }
      }
  }

  // Iniciar el procesamiento del texto
  processText();
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js#sha384-0DrKBsfUuJe/vqjia1HviapRn4mR1BYfCpQ9gT7qjSKu8TrzTe2tlbK3cI9i9EwV';
  script.onload = processDiv;
  document.head.appendChild(script);
  //processDiv();
})();
