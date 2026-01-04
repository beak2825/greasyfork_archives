// ==UserScript==
// @name Traduttore italiano-inglese2
// @version      1.1
// @license MIT
// @description traduci da Italiano a inglese su google meet
// @namespace Violentmonkey Scripts
// @author Flejta
// @match https://meet.google.com/*
// @include  https://meet.google.com/*
// @require https://update.greasyfork.org/scripts/433051/Trusted-Types%20Helper.user.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483859/Traduttore%20italiano-inglese2.user.js
// @updateURL https://update.greasyfork.org/scripts/483859/Traduttore%20italiano-inglese2.meta.js
// ==/UserScript==
(function () {
    const button = document.querySelector('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]');
    button.addEventListener('click', () => {
        executeFunctionAfterDelay(creaElemento, 10000);
    });
})();

function executeFunctionAfterDelay(func, delay) {
    setTimeout(func, delay);
}

function creaElemento() {
    'use strict';
    var innerHTMLText = '<input type="text" id="word" placeholder="Inserisci la parola da tradurre" style="margin-right: 10px;"><button id="translate">Traduci</button>';
    const newElement = document.createElement('div');
    newElement.innerHTML = '<input type="text" id="word" placeholder="Inserisci la parola da tradurre" style="margin-right: 10px;"><button id="translate">Traduci</button>';
    var divTraduzione = document.querySelector('.tMdQNe');
    divTraduzione.appendChild(newElement);

    // Aggiunge un listener al pulsante
    var pulsanteTraduci = document.getElementById('translate');
    pulsanteTraduci.addEventListener('click', function () {
        // Ottiene la parola inserita nel campo di testo
        var word = document.getElementById('word').value;

        // Invia la parola al servizio di traduzione di Google
        const urlBase = "https://translate.google.it/?hl=it&sl=it&tl=en&text=xxx%0A&op=translate";
        var urlToRedirect = urlBase.replace("xxx",encodeURIComponent(word));
        window.open (urlToRedirect,'_blank')

        //Resetto il campo di testo
        document.getElementById('word').value = "";

        //var xhr = new XMLHttpRequest();
        //xhr.open('GET', 'https://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=en&dt=t&q=' + encodeURIComponent(word), false);
        //xhr.send();

        // Estrae la traduzione dall'output del servizio di traduzione di Google
        //var response = JSON.parse(xhr.responseText);
        //var translation = response[0][0][0];

        // Visualizza la traduzione in un messaggio di alert
        alert('La traduzione di "' + word + '" in inglese è: ' + translation);
    });
};

function selectFirstElementWithOuterHTML(outerHTML) {
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].outerHTML.includes(outerHTML)) {
            return elements[i];
        }
    }
    return null;
}