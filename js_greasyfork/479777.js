// ==UserScript==
// @name         Prepara paniere completo
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Apre i link di tutte le dispense in una pagina nuova prima controlla che il captcha sia risolto
// @author       EasyMode
// @match    https://lms-courses.pegaso.multiversity.click/main/lp-video_student_view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multiversity.click
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479777/Prepara%20paniere%20completo.user.js
// @updateURL https://update.greasyfork.org/scripts/479777/Prepara%20paniere%20completo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var urlPagina=window.location.href;
    var urlConLezioni = "https://lms-courses.pegaso.multiversity.click/main/lp-video_student_view/lp-video_controller.php"

    if(urlPagina == urlConLezioni){
        var header = document.querySelector(".panel-default");
        var buttonGeneraPaniere = document.createElement("button");
        buttonGeneraPaniere.id = 'downloadPaniere';
        buttonGeneraPaniere.textContent = 'Scarica paniere';
        buttonGeneraPaniere.classList.add("scriptBtn");

        header.parentNode.insertBefore(buttonGeneraPaniere, header);

        buttonGeneraPaniere.addEventListener('click',function (){

            if (confirm('Hai già aggiornato il captcha dei numeri per la lezione? allora procedi con la generazione del paniere :-)')) {

                // Inizializza un array per contenere gli href completi
                var completeHrefArray = [];

                // Trova tutti i tag <a> che contengono un tag <i> con classe "icon-edit"
                var links = document.querySelectorAll('a i.icon-edit');

                // Itera su ogni link trovato
                links.forEach(function(icon) {
                    console.log("SCRIPT DOWNLOAD 1");

                    // Seleziona il tag <a> padre dell'elemento <i>
                    var link = icon.closest('a');
                    var number = icon.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling.lastElementChild.outerText

                    // Verifica se il tag <a> è stato trovato
                    if (link) {
                        // Ottieni l'attributo "href" dal tag <a>
                        var href = link.getAttribute('href');

                        // Concatena la stringa base con l'href e aggiungi all'array
                        var completeHref = number + "||" + "https://lms-courses.pegaso.multiversity.click/main/lp-video_student_view/" + href;
                        completeHrefArray.push(completeHref);
                        var sortedArray = completeHrefArray.sort
                        }
                });

                var urlFoundedInButtons = [];

                // Funzione per aprire una nuova scheda con link cliccabili
                function openNewTabWithLinks(linksArray) {
                    // Apri una nuova scheda
                    var newTab = window.open();

                    linksArray.sort(function(a, b) {
                        var aNumeroLezione = a.split(" ")[2];
                        var bNumeroLezione = b.split(" ")[2];

                        if (aNumeroLezione !== bNumeroLezione) {
                            return aNumeroLezione - bNumeroLezione;
                        } else {
                            return a.split(" ")[2] - b.split(" ")[2];
                        }
                    });

                    // Itera su ogni link e aggiungi un link cliccabile alla nuova scheda
                    linksArray.forEach(function(link) {
                        var anchor = document.createElement('div');
                        anchor.innerHTML = link;
                        anchor.style.display = 'block';
                        anchor.style.marginBottom = '70px';
                        newTab.document.body.appendChild(anchor);
                    });
                }

                function getUrlFromButton(url) {
                    console.log("Download Avviato");
                    var moreInfo = url.split("||")

                    return fetch(moreInfo[1])
                        .then(response => response.text())
                        .then(html => {
                        // Crea un elemento temporaneo per analizzare il codice HTML della pagina
                        var tempElement = document.createElement('div');
                        tempElement.innerHTML = html;

                        var scripts = tempElement.getElementsByTagName("script");
                        var scriptContent = "";
                        for (let script of scripts) {
                            scriptContent += script.textContent; //salva solo le righe delle domande e risposte
                        }

                        // Usa un'espressione regolare per trovare le risposte corretta nella pagina
                        var regex = /this\.rightAns\[\d+\]="\d+"/g; //sta nel tag <script>
                        var matches = scriptContent.match(regex);

                        var paniere = '';
                        for (let match of matches) {
                            var domande = '';
                            var option = '';
                            var questionNumber = match.match(/\d+/g)[0];
                            var correctAnswer = match.match(/\d+/g)[1];
                            var selector = 'input[name="d' + questionNumber + '"][value="' + correctAnswer + '"]';
                            var correctOption = tempElement.querySelector(selector);

                            for(let i = 1; i <= 4; i++){

                                if(i != correctAnswer){
                                    selector = 'input[name="d' + questionNumber + '"][value="' + i + '"]';
                                    option = tempElement.querySelector(selector);

                                    //recupera il testo contentente l'immagine
                                    var inputString = (option.parentNode.parentNode.children[1].innerHTML).toString();
                                    // Definisci un'espressione regolare per estrarre l'URL dell'immagine
                                    var regexUrl = /src="(.*?)"/;
                                    // Esegui la corrispondenza dell'espressione regolare sulla stringa di input
                                    var matchUrl = inputString.match(regexUrl);
                                    // Estrai l'URL dell'immagine se c'è una corrispondenza
                                    var imgRisposta = matchUrl ? matchUrl[1] : null;

                                    if(!!imgRisposta){
                                        domande += '<span class="correctOption" style="display:flex; align-items:center; color:darkRed;">' + `<img alt="" src="${imgRisposta}" title="img" style="max-height:180px"> ` + option.parentNode.parentNode.outerText.replace(/\t/, ") ") + '</span>'
                                    }else{
                                        domande += '<span class="correctOption" style="display:block; color:darkRed;">' + option.parentNode.parentNode.outerText.replace(/\t/, ") ") + '</span>'
                                    }

                                } else {

                                    selector = 'input[name="d' + questionNumber + '"][value="' + correctAnswer + '"]';
                                    option = tempElement.querySelector(selector);

                                    //recupera il testo contentente l'immagine
                                    var inputString2 = (option.parentNode.parentNode.children[1].innerHTML).toString();
                                    // Definisci un'espressione regolare per estrarre l'URL dell'immagine
                                    var regexUrl2 = /src="(.*?)"/;
                                    // Esegui la corrispondenza dell'espressione regolare sulla stringa di input
                                    var matchUrl2 = inputString2.match(regexUrl2);
                                    // Estrai l'URL dell'immagine se c'è una corrispondenza
                                    var imgRisposta2 = matchUrl2 ? matchUrl2[1] : null;

                                    if(!!imgRisposta2){
                                        domande += '<span class="correctOption" style="display:flex; align-items:center; color:green; font-weight:bold;">' + `<img alt="" src="${imgRisposta2}" title="img" style="max-height:180px"> ` + option.parentNode.parentNode.outerText.replace(/\t/, ") ") + ' | CORRETTA</span>'
                                    }else{
                                        domande += '<span class="correctOption" style="display:block; color:green; font-weight:bold"">' + option.parentNode.parentNode.outerText.replace(/\t/, ") ") + ' | CORRETTA</span>'
                                    }
                                }
                            }

                            if (correctOption) {
                                var numeroDomanda = correctOption.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.outerText
                                var testoDomanda = correctOption.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.lastElementChild.textContent.replace(/|\n|\r|\t/g, "").trim()

                                //recupera il testo contentente l'immagine
                                var inputString3 = (correctOption.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.lastElementChild.innerHTML).toString();
                                // Definisci un'espressione regolare per estrarre l'URL dell'immagine
                                var regexUrl3 = /src="(.*?)"/;
                                // Esegui la corrispondenza dell'espressione regolare sulla stringa di input
                                var matchUrl3 = inputString3.match(regexUrl3);
                                // Estrai l'URL dell'immagine se c'è una corrispondenza
                                var imgPresente3 = matchUrl3 ? matchUrl3[1] : null;

                                if(!!imgPresente3){
                                    paniere += '<span style="display:flex; align-items:center; font-weight:bold; margin: 30px auto 5px;">' + numeroDomanda + ')' + `<img alt="" src="${imgPresente3}" title="img" style="max-height:180px"> ` + testoDomanda + '</span>' + domande
                                }else{
                                    paniere += '<span style="display:block; font-weight:bold; margin: 30px auto 5px;">' + numeroDomanda + ')' + testoDomanda + '</span>' + domande
                                }
                            }

                        }

                        //Aggiunta paniere
                        var paniereVisible = '<h3 style="font-weight:bold;text-align:center">Lezione ' + moreInfo[0] + ' )' + tempElement.querySelectorAll('.list-group-item.title-lesson')[0].outerText + '</h3>' + paniere;

                        urlFoundedInButtons.push(paniereVisible);

                        console.log("Download terminato");

                    })
                        .catch(error => console.error('Errore durante il recupero della pagina:', error)
                              );


                }


                // Utilizza Promise.all per attendere che tutte le promesse si risolvano
                Promise.all(completeHrefArray.map(getUrlFromButton))
                    .then(() => {
                    var date = new Date();
                    urlFoundedInButtons.splice(0,0, `<h2 style="display:block;text-align:center">${document.getElementsByTagName('h4')[0].outerText} | ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</h2>`)
                    openNewTabWithLinks(urlFoundedInButtons);
                });

            } else {
                // Do nothing!
                alert("Clicca almeno su una lezione e risolvi il captcha per - Obbiettivi della lezione - DOPO riprova")
            }
        });
    }

})();

const injectCSS = css => {
    let el = document.createElement('style');
    el.type = 'text/css';
    el.innerText = css;
    document.head.appendChild(el);
    return el;
};

injectCSS(`
   .scriptBtn {
      margin: 10px 10px 20px 0;
      background-color: #a42c52;
      font-style: italic;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px;
      box-shadow: 5px 5px 8px -5px rgba(0,0,0,0.69);
   }

   #Paniere{
      padding: 20px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 8px 9px 13px -1px rgba(0,0,0,0.4);
   }

   .correctOption{
      color: green;
      text-decoration: underline;
      font-weight: bold;
      print-color-adjust: exact;
   }

   iframe {
      resize: both;
      overflow: auto;
   }

`);