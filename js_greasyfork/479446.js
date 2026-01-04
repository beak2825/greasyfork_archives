// ==UserScript==
// @name         Dispense revolver downloader
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Apre i link di tutte le dispense in una pagina nuova prima controlla che il captcha sia risolto
// @author       You
// @match    https://lms-courses.pegaso.multiversity.click/main/lp-video_student_view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multiversity.click
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479446/Dispense%20revolver%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/479446/Dispense%20revolver%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#content").append("<button id='downloadDispenze' style='position: absolute; top: 0; right: 0; display: inline-block; outline: none; cursor: pointer; font-size: 14px; line-height: 1; border-radius: 500px; transition-property: background-color, border-color, color, box-shadow, filter; transition-duration: .3s; border: 1px solid transparent; letter-spacing: 2px; min-width: 160px; text-transform: uppercase; white-space: normal; font-weight: 700; text-align: center; padding: 16px 14px 18px; color: #fff; background-color: #15883e; height: 48px;'>Scarica dispense</button>");
    $('#downloadDispenze').on('click',function (){

        if (confirm('Hai già aggiornato il captcha dei numeri per la lezione? allora procedi con il download :-)')) {

            // Inizializza un array per contenere gli href completi
            var completeHrefArray = [];

            // Trova tutti i tag <a> che contengono un tag <i> con classe "icon-reorder"
            var links = document.querySelectorAll('a i.icon-reorder');

            // Itera su ogni link trovato
            links.forEach(function(icon) {
                console.log("SCRIPT DOWNLOAD 1");

                // Seleziona il tag <a> padre dell'elemento <i>
                var link = icon.closest('a');

                // Verifica se il tag <a> è stato trovato
                if (link) {
                    // Ottieni l'attributo "href" dal tag <a>
                    var href = link.getAttribute('href');

                    // Concatena la stringa base con l'href e aggiungi all'array
                    var completeHref = "https://lms-courses.pegaso.multiversity.click/main/lp-video_student_view/" + href;
                    completeHrefArray.push(completeHref);
                }
            });

            var urlFoundedInButtons = [];

            // Funzione per aprire una nuova scheda con link cliccabili
            function openNewTabWithLinks(linksArray) {
                // Apri una nuova scheda
                var newTab = window.open();

                // Itera su ogni link e aggiungi un link cliccabile alla nuova scheda
                linksArray.forEach(function(link) {
                    var anchor = document.createElement('a');
                    anchor.href = link;
                    anchor.textContent = link;
                    anchor.style.display = 'block';
                    anchor.style.marginBottom = '10px';
                    anchor.target = '_blank'; // Apri il link in una nuova scheda
                    newTab.document.body.appendChild(anchor);
                });
            }

            function getUrlFromButton(url) {
                console.log("Download Avviato");

                return fetch(url)
                    .then(response => response.text())
                    .then(html => {
                    // Crea un elemento temporaneo per analizzare il codice HTML della pagina
                    var tempElement = document.createElement('div');
                    tempElement.innerHTML = html;

                    // Trova il bottone con classe "btn-default"
                    var button = tempElement.querySelector('.btn-default');

                    // Se il bottone è stato trovato, ottieni l'attributo "href"
                    if (button) {
                        var buttonHref = button.getAttribute('href');
                        urlFoundedInButtons.push(buttonHref);
                    }
                    console.log("Download terminato");

                })
                    .catch(error => console.error('Errore durante il recupero della pagina:', error));


            }


            // Utilizza Promise.all per attendere che tutte le promesse si risolvano
            Promise.all(completeHrefArray.map(getUrlFromButton))
                .then(() => {
                openNewTabWithLinks(urlFoundedInButtons);
            });

        } else {
            // Do nothing!
            alert("Clicca almeno su una lezione e risolvi il captcha per - Obbiettivi della lezione - DOPO riprova")
        }
    });

})();