// ==UserScript==
// @name         PostingTimer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Envoyer un message sur jeuxvideo.com à l'heure désirée.
// @author       PneuTueur
// @match        *://*.jeuxvideo.com/forums/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457412/PostingTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/457412/PostingTimer.meta.js
// ==/UserScript==

let intervalID;

function getTimeAndClick(dateCompare) {
    const button = document.querySelector('button.btn.btn-poster-msg.datalayer-push.js-post-message');
    const date = Date.now();
    const parsedDate = (new Date(date).getHours()<10?'0':'') + new Date(date).getHours() + ':' + (new Date(date).getMinutes()<10?'0':'') + new Date(date).getMinutes() + ':' + (new Date(date).getSeconds()<10?'0':'') + new Date(date).getSeconds();
    if (parsedDate==dateCompare) {
        button.click();
        clearInterval(intervalID);
        return 0;
    }
    return 1;
}

function postInit(dateToCompare, messageValue=null) {
    const messageArea = document.querySelector('textarea.area-editor.js-focus-field');
    if (messageValue!=='') {
        if (messageValue==='default') {
            messageArea.value = 'Test PEMT à ' + dateToCompare + '.';
        }
        else {
            messageArea.value = messageValue;
        }
    }
    intervalID = setInterval(getTimeAndClick, 10, dateToCompare);
    return 0;
}

const vanillaMessageButton = document.querySelector('button.btn.btn-poster-msg.datalayer-push.js-post-message');
const btn = document.createElement('button'); // Création, paramétrage et mise en page du bouton qui contrôle l'affichage des topics et messages d'Aegoia
const btnHTML = '<button id="posting-timer-button" class="btn btn-actu-new-list-forum btn-actualiser-forum" style="height:32.5px; width:130px; margin-right:10px;">Message avec timer</button>';
vanillaMessageButton.insertAdjacentHTML('afterend', btnHTML);

document.getElementById('posting-timer-button').addEventListener('click', event => {
    event.preventDefault();
    const postingTime = prompt('Entrez l\'heure à laquelle vous souhaitez envoyer le message (format XX:XX:XX).');
    if (postingTime===null) { return 1; }
    const dateRegexCheck = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]$/;
    if (!dateRegexCheck.test(postingTime)) {
        alert('Format invalide. Veuillez disposez');
        return 1;
    }
    const messageValue = prompt('Entrez le message que vous souhaitez envoyer à ' + postingTime + ' (ne mettez rien si vous avez déjà écrit votre message).', 'default');
    if (messageValue===null) { return 1; }
    postInit(postingTime, messageValue);
});
