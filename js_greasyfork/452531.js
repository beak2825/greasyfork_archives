// ==UserScript==
// @name         AegoiaStop
// @namespace    http://tampermonkey.net/
// @version      1.1.8
// @description  Cache les topics et messages de tous les comptes d'Aegoia et ajoute un bouton permettant à l'utilisateur de contrôler leur affichage.
// @author       Mr_Satisfaction
// @match        *://*.jeuxvideo.com/forums/*-50-*
// @match        *://*.jeuxvideo.com/recherche/forums/*-50-*
// @require      https://unpkg.com/string-similarity@4.0.4/umd/string-similarity.min.js
// @icon         https://image.noelshack.com/fichiers/2018/27/4/1530827992-jesusreup.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452531/AegoiaStop.user.js
// @updateURL https://update.greasyfork.org/scripts/452531/AegoiaStop.meta.js
// ==/UserScript==

function hideTopics() { // Fonction cachant les topics d'Aegoia lorsque appelée
    for (let foromer of foromers) {
        let pseudo = foromer.textContent.toLowerCase().replace(regex, ''); // On récupère le pseudo de l'auteur du topic (idem pour les fonctions suivantes)
        if (pseudo.includes('aego') || pseudo.includes('goia') || stringSimilarity.compareTwoStrings('aaegio', pseudo.split('').sort().join(''))>=0.5 || pseudo.includes('jew')) {
            foromer.parentNode.style.display = 'none'; // Si le pseudo de l'auteur du topic correspond au filtre on masque le topic
        }
    }
}

function showTopics() { // Fonction montrant les topics d'Aegoia lorsque appelée
    for (let foromer of foromers) {
        let pseudo = foromer.textContent.toLowerCase().replace(regex, '');
        if (pseudo.includes('aego') || pseudo.includes('goia') || stringSimilarity.compareTwoStrings('aaegio', pseudo.split('').sort().join(''))>=0.5 || pseudo.includes('jew')) {
            foromer.parentNode.style.display = 'grid'; // Si le pseudo de l'auteur du topic correspond au filtre on montre le topic
        }
    }
}

function hideMessages() { // Fonction cachant les messages d'Aegoia lorsque appelée
    for (let message of messages) {
        let pseudo = message.textContent.toLowerCase().replace(regex, '');
        if (pseudo.includes('aego') || pseudo.includes('goia') || stringSimilarity.compareTwoStrings('aaegio', pseudo.split('').sort().join(''))>=0.5 || pseudo.includes('jew')) {
            message.parentNode.parentNode.parentNode.style.display = 'none'; // Si le pseudo de l'auteur du message correspond au filtre on cache le message
        }
    }
}

function showMessages() { // Fonction montrant les messages d'Aegoia lorsque appelée
    for (let message of messages) {
        let pseudo = message.textContent.toLowerCase().replace(regex, '');
        if (pseudo.includes('aego') || pseudo.includes('goia') || stringSimilarity.compareTwoStrings('aaegio', pseudo.split('').sort().join(''))>=0.5 || pseudo.includes('jew')) {
            message.parentNode.parentNode.parentNode.style.display = 'block'; // Si le pseudo de l'auteur du message correspond au filtre on montre le message
        }
    }
}

function handleClick() { // Fonction appelée lorsqu'un bouton est cliqué
    if (localStorage.getItem('isScriptActivated')=='true') { // Si le script est déjà activé on le désactive
        showTopics();
        showMessages();
        localStorage.setItem('isScriptActivated', false); // On enregistre le statut de désactivation du script dans le stockage local du navigateur
        btn.innerText = 'Masquer Aegoia'; // On change les textes des deux boutons
        btn2.innerText = 'Masquer Aegoia';
    }
    else { // Si le script est désactivé on l'active
        hideTopics();
        hideMessages();
        localStorage.setItem('isScriptActivated', true); // On enregistre le statut d'activation du script dans le stockage local du navigateur
        btn.innerText = 'Montrer Aegoia'; // On change les textes des deux boutons
        btn2.innerText = 'Montrer Aegoia';
    }
}

const regex = /[^A-Za-z]/g; // Premier filtre du pseudo

let foromers = document.getElementsByClassName('xXx text-user topic-author'); // On récupère l'ensemble des pseudos des auteurs de la page de topics
let messages = document.getElementsByClassName('xXx bloc-pseudo-msg text-user'); // Et l'ensemble des pseudos des auteurs de messages du topic

const btn = document.createElement('button'); // Création, paramétrage et mise en page du bouton qui contrôle l'affichage des topics et messages d'Aegoia
btn.setAttribute('class', 'btn btn-actu-new-list-forum btn-actualiser-forum');
btn.style.setProperty('padding-left', '8px');
btn.style.setProperty('padding-right', '8px');
btn.style.setProperty('margin-left', 'auto');

const btn2 = btn.cloneNode(true); // Création d'un deuxième bouton visible en bas de page identique au oremier

if (localStorage.getItem('isScriptActivated')=='true' || !localStorage.getItem('isScriptActivated')) { // Si le script est activé (il l'est par défaut) on cache les topics et messages d'Aegoia
    localStorage.setItem('isScriptActivated', true);
    hideTopics();
    hideMessages();
    btn.innerText = 'Montrer Aegoia';
    btn2.innerText = 'Montrer Aegoia';
}
else {
    localStorage.setItem('isScriptActivated', false);
    btn.innerText = 'Masquer Aegoia'; // Sinon on change juste le texte des boutons
    btn2.innerText = 'Masquer Aegoia';
}

if (window.location.href.includes('0-50-0-1-0-')) {
    document.getElementsByClassName('bloc-pagi-default px-3 px-lg-0')[0].insertBefore(btn, document.getElementsByClassName('pagi-after')[0]); // Ajout des deux boutons dans les pages de forums
    document.getElementsByClassName('bloc-pagi-default px-3 px-lg-0')[1].insertBefore(btn2, document.getElementsByClassName('pagi-after')[1]);
}
else {
    document.getElementsByClassName('group-two')[0].appendChild(btn); // Ajout des deux boutons dans les topics
    document.getElementsByClassName('group-two')[1].appendChild(btn2);
}

btn.addEventListener('click', handleClick); // Lorsque le bouton est cliqué on appelle la fonction à exécuter
btn2.addEventListener('click', handleClick); // idem