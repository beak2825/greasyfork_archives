// ==UserScript==
// @name            YT Tradutor de Comentários
// @namespace       linkme.bio/jhonpergon/?userscript=translateYT
// @match           *://www.youtube.com/*
// @exclude         *://www.youtube.com/embed/*
// @version         1.0
// @author          Jhon Pérgon

// @name:pt         YT Tradutor de Comentários

// @description         Traduz comentários no Youtube de inglês para português, um quebra-galho enqunto o script oficial não é corrigido. Leia os detalhes.
// @description:pt      Traduz comentários no Youtube de inglês para português, um quebra-galho enqunto o script oficial não é corrigido. Leia os detalhes.

// @icon            https://cdn-icons-png.flaticon.com/512/2190/2190552.png
// @license         MIT
// @grant           none

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/492993/YT%20Tradutor%20de%20Coment%C3%A1rios.user.js
// @updateURL https://update.greasyfork.org/scripts/492993/YT%20Tradutor%20de%20Coment%C3%A1rios.meta.js
// ==/UserScript==

(function() {

 let getLangs = "en|pt"; //de inglês para português

function substituteSubstring(originalString, substringToReplace, newSubstring) {
    return originalString.replace(substringToReplace, newSubstring);
}

let conteComments = 0;

 function addTranslate(){
    // Adiciona o evento a todas as tags com a classe "script-description description"
    document.querySelectorAll('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap').forEach(item => {

      if (item.textContent.includes("➜")) {
            //return true;
        }else{
          conteComments++;
          item.innerHTML += " ➜ <strong style='color:#7efffb;cursor:pointer'>[traduzir]</strong>";
          item.addEventListener('click', function() {
              // Captura o texto do elemento clicado
            let texto = this.textContent;

            let originalString = texto;
            let substringToReplace = "[traduzir]";
            let newSubstring = "<strong style='color:#a0a0ff;cursor:pointer'>[...]</strong>";
            let resultx = substituteSubstring(originalString, substringToReplace, "");
            item.innerHTML = resultx+newSubstring;
            texto = resultx+newSubstring;

            if(getLangs !== ""){
              let textoEnviado = texto;
              let apiURL = "https://api.mymemory.translated.net/get";
              let params = {
                  q: textoEnviado,
                  langpair: getLangs
              };

              let queryString = Object.keys(params)
              .map(key => key + '=' + encodeURIComponent(params[key]))
              .join('&');

              let requestUrl = apiURL + '?' + queryString;

              fetch(requestUrl)
              .then(response => response.json())
              .then(data => {
                if (data && data.responseData && data.responseData.translatedText) {
                 // console.log("Tradução: ", data.responseData.translatedText);
                  let textoTraduzido = data.responseData.translatedText
                    let originalString = textoTraduzido;
                    let substringToReplace = "<strong style='color:#a0a0ff;cursor:pointer'>[...]</strong>";
                    let newSubstring = `<strong style='color:#5aff5f;cursor:pointer'>[traduzido]</strong>`;
                    let resultx = substituteSubstring(originalString, substringToReplace, "");
                    //console.log(result);
                  item.innerHTML = resultx+newSubstring;
                } else {
                  this.textContent = "Não foi possível traduzir o texto.";
                }
              })
              .catch(error => {
                  if(error){
                      this.textContent = error;
                  }else{
                      this.textContent = "[ERRO: Sem conexão com a internet].";
                  }
              });
          }

        });
      }
    });

  }

    setTimeout(function() {
        setInterval(addTranslate, 1500);
    }, 3500);


})();