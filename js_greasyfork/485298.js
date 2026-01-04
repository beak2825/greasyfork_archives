// ==UserScript==
// @name           Contacter moderation MP
// @description    Permet de joindre l'url d'un topic en MP à la mode
// @author         Atlantis
// @license        MIT
// @version        13.5.0
// @icon           https://avatars.fastly.steamstatic.com/c21402b3513e2194d4d478128efc97f0bda17189_full.jpg
// @namespace      Contacter moderation MP
// @match          *://www.jeuxvideo.com/forums/1-*
// @match          *://www.jeuxvideo.com/forums/42-*
// @match          *://www.jeuxvideo.com/forums/message/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/485298/Contacter%20moderation%20MP.user.js
// @updateURL https://update.greasyfork.org/scripts/485298/Contacter%20moderation%20MP.meta.js
// ==/UserScript==


//ancre
let urlAncre = ''


var basePageUrlbase = window.location.href; // Variable pour stocker l'URL de la page de base
var basePageUrlb = basePageUrlbase.replace(/-(\d+)-(\d+)-(\d+)-/, "-$1-$2-1-");
var basePageUrl = basePageUrlb.replace(/#.*$/, "");

var basePageUrlPoC = basePageUrlb.replace(/^((?:[^-]*-){7}).*$/, "$10.htm");
var basePageUrlPoC2 = basePageUrlb.replace(/^((?:[^-]*-){7}).*$/, "$1post-ou-cancer.htm");


function changePageAndPrepopulate(urlmodoAll, prepopulateMessageBase) {
    var newTab = window.open(urlmodoAll, "_blank");
    newTab.addEventListener('load', function () {
        prepopulateMessageBase(newTab);
    });
}


function prepopulateMessageBase(tab) {
    var messageTextArea = tab.document.querySelector("#message");
    inputText(messageTextArea, "\n\n" + basePageUrlbase);
}

function prepopulateMessageGlissadeGDC(tab) {
    var titreAreamsg = tab.document.querySelector("#conv_titre");
    var messageTextArea = tab.document.querySelector("#message");
    inputText(titreAreamsg, 'Topic glissant');
    inputText(messageTextArea, `Topic glissant\n\n` + basePageUrl);
}


function prepopulateMessageHSGDC(tab) {
    var titreAreamsg = tab.document.querySelector("#conv_titre");
    var messageTextArea = tab.document.querySelector("#message");
    inputText(titreAreamsg, 'H.S. non lié JV');
    inputText(messageTextArea, `Hors sujet\n\n` + basePageUrl);
}


function prepopulateMessagePoC(tab) {
    var titles = [
        'Topic "post ou c"',
        'Topic "Post ou Cancer"',
        'Topic Post ou C'
    ];

    /* Url classique PoC */
    var messages = [
        `Topic post ou c\n\n` + basePageUrl,
        `topic "Post ou c"\n\n` + basePageUrl,
        `"Post ou C"\n\n` + basePageUrl
    ];
    /**/

    /* Url PoC 
    var messages = [
        `Topic post ou c\n\n` + basePageUrlPoC2,
        `topic "Post ou c"\n\n` + basePageUrlPoC,
        `"Post ou C"\n\n` + basePageUrlPoC2
    ];
    */

    var randomIndex = Math.floor(Math.random() * 3);
    var titreAreamsg = tab.document.querySelector("#conv_titre");
    var messageTextArea = tab.document.querySelector("#message");
    inputText(titreAreamsg, titles[randomIndex]);
    inputText(messageTextArea, messages[randomIndex]);
}


function prepopulateMessageHC(tab) {
    var titles = [
        'Donnees HC via MP',
        'Demande de données HC via MP',
        'Donnees Hors charte par MP'
    ];

    var messages = [
        `Donnees hors charte via MP\n\n` + basePageUrl,
        `Demande de données HC via MP\n\n` + basePageUrl,
        `Donnees Hors charte par MP\n\n` + basePageUrl
    ];

    var randomIndex = Math.floor(Math.random() * 3);
    var titreAreamsg = tab.document.querySelector("#conv_titre");
    var messageTextArea = tab.document.querySelector("#message");
    inputText(titreAreamsg, titles[randomIndex]);
    inputText(messageTextArea, messages[randomIndex]);
}

function prepopulateMessageNomi(tab) {
    var titles = [
        'Topic nominatif',
        'Nominatif',
        'Topic nomi'
    ];

    var messages = [
        `Topic Nominatif\n\n` + basePageUrl,
        `Nomi\n\n` + basePageUrl,
        `Nominatif\n\n` + basePageUrl
    ];

    var randomIndex = Math.floor(Math.random() * 3);
    var titreAreamsg = tab.document.querySelector("#conv_titre");
    var messageTextArea = tab.document.querySelector("#message");
    inputText(titreAreamsg, titles[randomIndex]);
    inputText(messageTextArea, messages[randomIndex]);
}


function prepopulateMessageMaj(tab) {
    var titles = [
        'Titre full maj',
        'Full maj',
        'Topic MAJ'
    ];

    var messages = [
        `titre full maj\n\n` + basePageUrl,
        `full maj\n\n` + basePageUrl,
        `Titre Topic MAJ\n\n` + basePageUrl
    ];

    var randomIndex = Math.floor(Math.random() * 3);
    var titreAreamsg = tab.document.querySelector("#conv_titre");
    var messageTextArea = tab.document.querySelector("#message");
    inputText(titreAreamsg, titles[randomIndex]);
    inputText(messageTextArea, messages[randomIndex]);
}

let lienmodoAll = document.querySelector('.lien-pratique-gestion a');
lienmodoAll.addEventListener('click', function (event) {
    let urlmodoAll = lienmodoAll.href;
    event.preventDefault(); // Empêche le comportement par défaut (ouverture du lien)
    changePageAndPrepopulate(urlmodoAll, prepopulateMessageBase);
});


if (window.location.href.includes("jeuxvideo.com/forums/1-") || window.location.href.includes("jeuxvideo.com/forums/42-")) {
    //tous_les_fofo
    let lienPratiqueGestion = document.querySelector('.lien-pratique-gestion');
    let lienmodoAll = document.querySelector('.lien-pratique-gestion a');
    let urlmodoAll = lienmodoAll.href + urlAncre;

    var nouveauLien1 = document.createElement('a');
    nouveauLien1.setAttribute('role', 'button');
    nouveauLien1.className = "xXx lien-jv";
    nouveauLien1.textContent = "Contact Modé Nomi";
    nouveauLien1.addEventListener('click', () => {
        changePageAndPrepopulate(urlmodoAll, prepopulateMessageNomi);
    });
    lienPratiqueGestion.appendChild(document.createElement('br'));
    lienPratiqueGestion.appendChild(nouveauLien1);

    var nouveauLien2 = document.createElement('a');
    nouveauLien2.setAttribute('role', 'button');
    nouveauLien2.className = "xXx lien-jv";
    nouveauLien2.textContent = " - Contact Full Maj";
    nouveauLien2.addEventListener('click', () => {
        changePageAndPrepopulate(urlmodoAll, prepopulateMessageMaj);
    });
    lienPratiqueGestion.appendChild(nouveauLien2);
}

if (window.location.href.includes("jeuxvideo.com/forums/1-51") || window.location.href.includes("jeuxvideo.com/forums/42-51")) {
    //seulement_sur_le_51
    let lienPratiqueGestion = document.querySelector('.lien-pratique-gestion');
    let lienmodoAll = document.querySelector('.lien-pratique-gestion a');
    let urlmodoAll = lienmodoAll.href + urlAncre;

    var nouveauLien3 = document.createElement('a');
    nouveauLien3.setAttribute('role', 'button');
    nouveauLien3.className = "xXx lien-jv";
    nouveauLien3.textContent = "Contact Modé PoC -";
    nouveauLien3.addEventListener('click', () => {
        changePageAndPrepopulate(urlmodoAll, prepopulateMessagePoC);
    });
    lienPratiqueGestion.appendChild(document.createElement('br'));
    lienPratiqueGestion.appendChild(nouveauLien3);

    var nouveauLien4 = document.createElement('a');
    nouveauLien4.setAttribute('role', 'button');
    nouveauLien4.className = "xXx lien-jv";
    nouveauLien4.textContent = " Contact Modé HC MP";
    nouveauLien4.addEventListener('click', () => {
        changePageAndPrepopulate(urlmodoAll, prepopulateMessageHC);
    });
    lienPratiqueGestion.appendChild(nouveauLien4);

}


if (window.location.href.includes("jeuxvideo.com/forums/1-36") || window.location.href.includes("jeuxvideo.com/forums/42-36")) {
    //seulement_sur_GDC
    let lienPratiqueGestion = document.querySelector('.lien-pratique-gestion');
    let lienmodoAll = document.querySelector('.lien-pratique-gestion a');
    let urlmodoAll = lienmodoAll.href + urlAncre;

    var nouveauLien5 = document.createElement('a');
    nouveauLien5.setAttribute('role', 'button');
    nouveauLien5.className = "xXx lien-jv";
    nouveauLien5.textContent = "Contact Glissant";
    nouveauLien5.addEventListener('click', () => {
        changePageAndPrepopulate(urlmodoAll, prepopulateMessageGlissadeGDC);
    });
    lienPratiqueGestion.appendChild(document.createElement('br'));
    lienPratiqueGestion.appendChild(nouveauLien5);

    var nouveauLien6 = document.createElement('a');
    nouveauLien6.setAttribute('role', 'button');
    nouveauLien6.className = "xXx lien-jv";
    nouveauLien6.textContent = " - Contact HS";
    nouveauLien6.addEventListener('click', () => {
        changePageAndPrepopulate(urlmodoAll, prepopulateMessageHSGDC);
    });
    lienPratiqueGestion.appendChild(nouveauLien6);
}


//react fonction
function inputText(textareaElement, value) {
    //textareaElement.value = value;

   const prototype = Object.getPrototypeOf(textareaElement);
   const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
   nativeSetter.call(textareaElement, value);
   textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
}



