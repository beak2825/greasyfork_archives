// ==UserScript==
// @name         Afficher_Nombres_dabonnes
// @namespace    Afficher_Nombres_dabonnes
// @version      1.3.9
// @description  Afficher directement le nombre d'abonnés sur la page abonné d'un profil.
// @author       Atlantis
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/128px/1f4af.png
// @match        *://www.jeuxvideo.com/profil/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494797/Afficher_Nombres_dabonnes.user.js
// @updateURL https://update.greasyfork.org/scripts/494797/Afficher_Nombres_dabonnes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour extraire le numéro de page à partir de l'URL
    function getPageNumberFromUrl(url) {
        const pageNumberMatch = url.match(/&page=(\d+)/);
        return pageNumberMatch ? parseInt(pageNumberMatch[1]) : 1;
    }

    // Fonction pour gérer la pagination
    async function handlePaginationElement(doc) {
        const paginationElement = doc.querySelector('.pagi-fin-actif');
        if (paginationElement) {
            // Si fleche fin existe => fetch
            const lastPageUrl = paginationElement.getAttribute('href');
            const response = await fetch(lastPageUrl);
            const text = await response.text();
            const parser = new DOMParser();
            const tempDiv = parser.parseFromString(text, 'text/html');
            const numberOfFicheAbonneElementsOnLastPage = tempDiv.querySelectorAll('.fiche-abonne').length;
            const resultAboAllPage = ((getPageNumberFromUrl(lastPageUrl) - 1) * 51) + numberOfFicheAbonneElementsOnLastPage;
            ShowOnJVC(resultAboAllPage);
            sessionStorage.setItem("abo-counter", resultAboAllPage);
        } else {
            // Si fleche existe pas => derniere page => calcul direct
            const numberOfFicheAbonneElements = doc.querySelectorAll('.fiche-abonne').length;
            if (numberOfFicheAbonneElements === 0) {
                const currentURL = window.location.href;
                if (currentURL.match(/&page=(\d+)/)) {
                    const newURL = currentURL.replace(/&page=(\d+)/, '');
                    window.location.href = newURL;
                }
            }
            const currentPageNumber = getPageNumberFromUrl(window.location.href);
            const resultAboAllPage = ((currentPageNumber - 1) * 51) + numberOfFicheAbonneElements;
            ShowOnJVC(resultAboAllPage);
            sessionStorage.setItem("abo-counter", resultAboAllPage);
        }
    }

    function jvCake(classe) {
        const base16 = '0A12B34C56D78E9F';
        let lien = '';
        const s = classe.split(' ')[1];
        for (let i = 0; i < s.length; i += 2) {
            lien += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
    }
        return lien;
    }

    // Fonction pour gérer le lien crypte
    function decodeElements(doc) {
        const cryptElements = doc.querySelectorAll('.JvCare.pagi-fin-actif');
        cryptElements.forEach(element => {
            const decodedClass = jvCake(element.className);
            const newAnchor = document.createElement('a');
            const hrefValue = element.getAttribute('href');
            newAnchor.setAttribute('href', decodedClass);
            newAnchor.classList.add('pagi-fin-actif');
            element.parentNode.replaceChild(newAnchor, element);
        });
    }

    // Fonction pour afficher le nombre d'abonnés
    function ShowOnJVC(result) {
        const aboLink = document.querySelector('a.lien-profil[href$="?mode=abonne"], a.lien-profil[href*="?mode=abonne&"]');
        if (aboLink) {
            aboLink.textContent = 'Abo (' + result + ')';
            aboLink.classList.remove('icon-people');
        }
        const menuTitle = document.querySelector('.menu-profil-title');
        if (menuTitle && menuTitle.querySelector('.icon-people')) {
            menuTitle.innerHTML = '<i class="icon-people"></i> Abo (' + result + ')';
        }
    }

    // Fonction principale
    async function calculabomain() {
        //calcul directement si on est sur la page abonne
        if (window.location.search.match(/(\?|\&)mode=abonne(&|$)/)) {
            ShowOnJVC('Load');
            await handlePaginationElement(document);
        } else {
            // si ce nest PAS sur mobile affiche le resultat sur d'autres pages profil via fetch
            if (!navigator.userAgent.toLowerCase().includes('mobile')) {
                ShowOnJVC('Load');
                const abonneUrl = window.location.href.replace(/(\?.*)?$/, '?mode=abonne');
                const iconPeopleElement = document.querySelector('a.lien-profil[href$="?mode=abonne"]');
                if (iconPeopleElement) {
                    const fallbackUrl = iconPeopleElement.href;
                    const response = await fetch(fallbackUrl);
                    const text = await response.text();
                    const parser = new DOMParser();
                    const tempDiv2 = parser.parseFromString(text, 'text/html');
                    decodeElements(tempDiv2);
                    await handlePaginationElement(tempDiv2);
                }
            }
        }
    }

//economise de la bande passante grace au session storage
const currentProfile = window.location.href.split("profil/")[1]?.split("?")[0];
if (currentProfile) {
    const currentCounter = sessionStorage.getItem("abo-counter");
    // si le profil ne correspond pas ou si le nombre dabonne est pas definit => calcul
    if (sessionStorage.getItem("abo-profiler") !== currentProfile || !currentCounter) {
        sessionStorage.removeItem("abo-counter"); // Réinitialiser le sessionStorage
        sessionStorage.removeItem("abo-profiler"); // Réinitialiser le sessionStorage
        sessionStorage.setItem("abo-profiler", currentProfile); // Enregistrer le nouveau profil
        calculabomain(); // Exécuter la fonction principale (calcul abonnés)
    } else {
        //via sessionStorage
        //afiche la valeurs sur toute les pages (PC)
        if (!navigator.userAgent.toLowerCase().includes('mobile')) {
            ShowOnJVC(currentCounter);
        //afiche la valeurs la page abo only (Mobile)
        } else {
            if (window.location.search.match(/(\?|\&)mode=abonne(&|$)/)) {
                ShowOnJVC(currentCounter);
            }
        }
    }
}

//vide sessionStorage bouton abonne
const bellButton = document.querySelector('.bloc-option-profil .icon-bell-off, .bloc-option-profil .icon-bell-on');
bellButton.addEventListener('click', () => {
    sessionStorage.removeItem("abo-counter"); // Réinitialiser le sessionStorage
    sessionStorage.removeItem("abo-profiler"); // Réinitialiser le sessionStorage
});

})();