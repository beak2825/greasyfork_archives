// ==UserScript==
// @name      Script for Pass-Education to download without subscription
// @name:fr         Script pour Pass-Education pour télécharger sans abonnement
// @name:en      Script for Pass-Education to download without subscription
// @description This script modifies download links on the Pass-Éducation website to allow file downloads without a subscription. It also removes Google Tag Manager (GTM) iframes that appear on the page.
// @description:fr  Ce script permet de modifier les liens de téléchargement sur le site Pass-Éducation afin de télécharger des fichiers sans avoir à payer un abonnement. Il supprime également les iframes de Google Tag Manager (GTM) qui apparaissent sur la page.
// @description:en This script modifies download links on the Pass-Éducation website to allow file downloads without a subscription. It also removes Google Tag Manager (GTM) iframes that appear on the page.
// @namespace    http://tampermonkey.net/
// @version      1.2
// @match        https://*.pass-education.fr/*
// @grant        none
// @license      MIT
// @author       TrouveMe
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=steevenvanachte@ik.me&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/534102/Script%20pour%20Pass-Education%20pour%20t%C3%A9l%C3%A9charger%20sans%20abonnement.user.js
// @updateURL https://update.greasyfork.org/scripts/534102/Script%20pour%20Pass-Education%20pour%20t%C3%A9l%C3%A9charger%20sans%20abonnement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ferme les pop-ups de consentement si présents
    const consentButton = document.querySelector('.cc-btn.cc-dismiss.cc-btn-no-href');
    if (consentButton) {
        consentButton.click();
    }

    // Supprime le pop-up de connexion si présent
    const loginPopUp = document.querySelector('.callout.warning.link-attachment');
    if (loginPopUp) {
        loginPopUp.remove();
    }

    // Liste pour garder trace des liens déjà mis à jour
    let lastUpdatedLinks = [];

    // Fonction pour mettre à jour les liens
    function updateLinks() {
        const links = document.querySelectorAll('.auth-href');

        links.forEach(link => {
            // Assurez-vous que le lien n'a pas déjà été modifié pour éviter la récursion infinie
            if (lastUpdatedLinks.includes(link.href)) return;

            const url = new URL(link.href);
            const attachmentId = url.searchParams.get('attachment_id');
            const archiveId = url.searchParams.get('archive_id');

            if (attachmentId) {
                link.href = 'https://cdn.pass-education.fr/download.php?attachment_id=' + attachmentId;
                console.log('Nouveau lien attachment:', link.href);
            }

            if (archiveId) {
                link.href = 'https://cdn.pass-education.fr/download.php?archive_id=' + archiveId;
                console.log('Nouveau lien archive:', link.href);
            }

            // Ajout à la liste des liens modifiés pour éviter la récursion infinie
            lastUpdatedLinks.push(link.href);
        });
    }

    // Observer de mutations pour surveiller les changements dans le DOM
    const observer = new MutationObserver((mutationsList) => {
        // Ne traiter que les mutations concernant l'ajout de nouveaux liens pertinents
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                // Vérifiez si un élément contenant des liens à mettre à jour est ajouté
                if (node.querySelectorAll && node.querySelectorAll('.auth-href').length) {
                    updateLinks(); // Mettre à jour les liens dès qu'ils sont ajoutés
                }

                // Si une iframe GTM est ajoutée, on la supprime
                if (node.tagName === 'IFRAME' && node.src.includes('googletagmanager.com/ns.html')) {
                    console.log('Suppression iframe GTM:', node.src);
                    node.remove();
                }
            }
        }
    });

    // Configurer l'observateur pour surveiller l'ajout de nouveaux éléments
    observer.observe(document.body, {
        childList: true,  // Surveiller l'ajout/suppression d'éléments
        subtree: true,    // Inclure tous les sous-éléments de la page
    });

    // Appeler une première fois pour modifier les liens déjà présents dans la galerie
    updateLinks();
})();
