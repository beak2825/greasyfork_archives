// ==UserScript==
// @name         haloween timer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Affiche le temps restant jusqu'à Halloween
// @author       You
// @icon         https://image.noelshack.com/fichiers/2022/40/4/1665057946-jesuscitrouillerevenantgentil.png
// @grant        none
// @match        https://onche.org/forum/*
// @match        https://onche.org/topic/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477209/haloween%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/477209/haloween%20timer.meta.js
// ==/UserScript==

// Sélectionnez tous les éléments ayant la classe "content centered"
let contentCenteredDivs = document.getElementsByClassName("content centered");

// Créez un élément pour afficher l'image de la citrouille
let citrouilleImg = document.createElement('img');
citrouilleImg.src = 'https://image.noelshack.com/fichiers/2022/40/4/1665057946-jesuscitrouillerevenantgentil.png';
citrouilleImg.style.width = "40px";
citrouilleImg.style.height = "40x";

// Créez un élément pour afficher l'heure
let heureSpan = document.createElement('span');
heureSpan.style.fontWeight = "bold";
heureSpan.style.fontSize = "13px";
heureSpan.style.color = "#71c2fb";

// Créez un élément pour afficher le temps restant jusqu'à Halloween en orange
let halloweenCountdownSpan = document.createElement('span');
halloweenCountdownSpan.style.fontWeight = "bold";
halloweenCountdownSpan.style.fontSize = "13px";
halloweenCountdownSpan.style.color = "#ff9900";  // Couleur orange

// Ajoutez l'élément citrouilleImg, heureSpan et halloweenCountdownSpan à chaque div "content centered"
for (let i = 0; i < contentCenteredDivs.length; i++) {
    contentCenteredDivs[i].appendChild(citrouilleImg.cloneNode(true));
    contentCenteredDivs[i].appendChild(heureSpan.cloneNode(true));
    contentCenteredDivs[i].appendChild(halloweenCountdownSpan.cloneNode(true));
}

// Calculez la date d'Halloween (31 octobre de l'année actuelle)
const currentYear = new Date().getFullYear();
const halloweenDate = new Date(currentYear, 9, 31);

// Mettez à jour l'heure, le compteur et le temps restant toutes les secondes
setInterval(function() {
    const now = new Date();
    const frenchTime = now.toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Calculez le temps restant jusqu'à Halloween
    const timeUntilHalloween = halloweenDate - now;
    const daysUntilHalloween = Math.floor(timeUntilHalloween / (1000 * 60 * 60 * 24));
    const hoursUntilHalloween = Math.floor((timeUntilHalloween % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesUntilHalloween = Math.floor((timeUntilHalloween % (1000 * 60 * 60)) / (1000 * 60));
    const secondsUntilHalloween = Math.floor((timeUntilHalloween % (1000 * 60)) / 1000);

    for (let i = 0; i < contentCenteredDivs.length; i++) {
        contentCenteredDivs[i].querySelector('span').textContent = frenchTime;
        contentCenteredDivs[i].querySelectorAll('span')[1].textContent = `Halloween: ${daysUntilHalloween}j ${hoursUntilHalloween}h ${minutesUntilHalloween}m ${secondsUntilHalloween}s`;
    }
}, 1000);  // Mettre à jour toutes les secondes
