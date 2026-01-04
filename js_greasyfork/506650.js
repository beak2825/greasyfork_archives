// ==UserScript==
// @name         Tinder Unblur
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unblur Tinder fast match teasers
// @match        https://tinder.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506650/Tinder%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/506650/Tinder%20Unblur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per ottenere il token di autenticazione
    function getAuthToken() {
        return localStorage.getItem("TinderWeb/APIToken");
    }

    // Funzione principale per sbloccare le immagini
    async function unblur() {
        const authToken = getAuthToken();
        if (!authToken) {
            console.error("Tinder Unblur: Auth token non trovato.");
            return;
        }

        try {
            const response = await fetch("https://api.gotinder.com/v2/fast-match/teasers", {
                headers: {
                    "X-Auth-Token": authToken,
                    "Platform": "android",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error(`Tinder Unblur: Errore nel fetch - ${response.statusText}`);
                return;
            }

            const data = await response.json();
            const teasers = data?.data?.results;

            if (!teasers || !Array.isArray(teasers)) {
                console.error("Tinder Unblur: Dati teaser non validi.");
                return;
            }

            // Seleziona gli elementi teaser nel DOM
            const teaserEls = document.querySelectorAll(
                ".Expand.enterAnimationContainer > div:nth-child(1)"
            );

            teasers.forEach((teaser, index) => {
                const teaserEl = teaserEls[index];
                if (teaserEl && teaser.user && teaser.user.photos && teaser.user.photos.length > 0) {
                    const photo = teaser.user.photos[0];
                    const teaserImage = `https://preview.gotinder.com/${teaser.user._id}/original_${photo.id}.jpeg`;
                    teaserEl.style.backgroundImage = `url(${teaserImage})`;
                    teaserEl.style.filter = 'none'; // Rimuove eventuali filtri di sfocatura
                }
            });

            console.log("Tinder Unblur: Immagini sbloccate con successo.");
        } catch (error) {
            console.error("Tinder Unblur: Errore durante l'unblur delle immagini.", error);
        }
    }

    // Esegui la funzione unblur quando la pagina è completamente caricata
    window.addEventListener('load', () => {
        // Attendere qualche secondo per assicurarsi che gli elementi siano caricati
        setTimeout(unblur, 3000);
    });

    // Utilizza MutationObserver per gestire nuovi teaser caricati dinamicamente
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                unblur();
            }
        }
    });

    // Configura l'osservatore
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    // Crea un pulsante per attivare manualmente la funzione unblur
    const unblurButton = document.createElement('button');
    unblurButton.textContent = 'Sblocca Immagini!';
    unblurButton.style.position = 'fixed';
    unblurButton.style.top = '10px';
    unblurButton.style.left = '50%';
    unblurButton.style.transform = 'translateX(-50%)'; // Centra orizzontalmente
    unblurButton.style.zIndex = '9999';
    unblurButton.style.backgroundColor = '#FE3C72'; // Rosso Tinder
    unblurButton.style.color = '#FFFFFF'; // Testo bianco
    unblurButton.style.border = 'none';
    unblurButton.style.borderRadius = '20px';
    unblurButton.style.padding = '10px 20px';
    unblurButton.style.fontSize = '16px';
    unblurButton.style.cursor = 'pointer';
    unblurButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    unblurButton.style.transition = 'background-color 0.3s ease, transform 0.3s ease';

    // Aggiungi effetti hover e attivi
    unblurButton.addEventListener('mouseover', function() {
        unblurButton.style.backgroundColor = '#FF6B81'; // Rosso leggermente più chiaro
        unblurButton.style.transform = 'translateX(-50%) scale(1.05)';
    });

    unblurButton.addEventListener('mouseout', function() {
        unblurButton.style.backgroundColor = '#FE3C72'; // Rosso Tinder
        unblurButton.style.transform = 'translateX(-50%) scale(1)';
    });

    unblurButton.addEventListener('click', () => {
        unblur();
        // Fornisci feedback visivo all'utente
        unblurButton.textContent = 'Sbloccato!';
        setTimeout(() => {
            unblurButton.textContent = 'Sblocca Immagini!';
        }, 2000);
    });

    document.body.appendChild(unblurButton);
})();