// ==UserScript==
// @name         InscriptionDateMessageJVC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ajoute la date de création du compte de l'auteur du message dans la signature du message.
// @author       Mr_Satisfation
// @match        *://*.jeuxvideo.com/forums/42-*
// @icon         https://risibank.fr/cache/medias/0/1/136/13653/full.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454636/InscriptionDateMessageJVC.user.js
// @updateURL https://update.greasyfork.org/scripts/454636/InscriptionDateMessageJVC.meta.js
// ==/UserScript==

const htmlParser = new DOMParser();

async function getDate(html) { // Retourne la date de création d'un compte à partir du html retourné par la requête vers la page de ce compte
    const infoKeys = html.querySelectorAll('div.info-lib');
    for (let key of infoKeys) {
        if (key.textContent==='Membre depuis :') {
            const inscriptionDate = key.parentNode.querySelector('div.info-value').textContent.split(' (')[0];
            return inscriptionDate;
        }
    }
}

const pseudos = document.querySelectorAll('a.xXx.bloc-pseudo-msg.text-user'); // Liste des pseudos de la page
for (const pseudo of pseudos) {
    const url = pseudo.getAttribute('href'); // On récupère l'URL de chaque pseudo
    fetch(url).then(response => { return response.text(); }) // Requête vers l'URL
      .then(async html => {
        const DOM = htmlParser.parseFromString(html, 'text/html');
        const inscriptionDate = await getDate(DOM); // On appelle la fonction getDate
        if (inscriptionDate) {
            let conteneurSignature = pseudo.parentNode.parentNode.querySelector('div.signature-msg.text-enrichi-forum') // Ajout et mise en page de l'information dans le cadre "Signature" du message
            if (!conteneurSignature) {
                const conteneurDate = document.createElement('div');
                conteneurDate.setAttribute('class', 'signature-msg  text-enrichi-forum');
                const textDate = document.createElement('p');
                textDate.setAttribute('style', 'font-size:0.75rem; line-height:1rem;');
                textDate.textContent = 'Membre depuis : ';
                const textDateValue = document.createElement('strong');
                textDateValue.textContent = inscriptionDate;
                textDate.append(textDateValue);
                conteneurDate.append(textDate);
                pseudo.parentNode.parentNode.querySelector('div.bloc-contenu').append(conteneurDate);
            }
            else {
                const textDate = document.createElement('p');
                textDate.setAttribute('style', 'font-size:0.75rem; line-height:1rem;');
                textDate.textContent = 'Membre depuis : ';
                const textDateValue = document.createElement('strong');
                textDateValue.textContent = inscriptionDate;
                textDate.append(textDateValue);
                conteneurSignature.append(textDate);
            }
        }
    })
      .catch(err => { console.error(err); alert('InscriptionDateMessageJVC: An error occured. Please refresh the page.'); }); // Si erreur pendant la requête
}