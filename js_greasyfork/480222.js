// ==UserScript==
// @name         Leboncoin Annonce Filter
// @namespace    http://tampermonkey.net/
// @version      01.0
// @description  Interface pour filtrer les annonces sur Leboncoin, avec bouton de réinitialisation
// @author       IAceI
// @match        https://www.leboncoin.fr/*recherche*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480222/Leboncoin%20Annonce%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/480222/Leboncoin%20Annonce%20Filter.meta.js
// ==/UserScript==
// @license MIT
(function() {
    'use strict';

    // Créer l'interface utilisateur
    function creerInterface() {
        const container = document.createElement('div');
        container.innerHTML = `
            <div style="position: fixed; top: 50%; right: 10px; transform: translateY(-50%); background: white; padding: 10px; border: 1px solid black; z-index: 1000;">
                <div>
                    <input type="radio" id="masquerVenduEtAchat" name="filtreAnnonce" value="masquer">
                    <label for="masquerVenduEtAchat">Masquer 'Vendu' et 'Achat en cours'</label>
                </div>
                <div>
                    <input type="radio" id="afficherLivraison" name="filtreAnnonce" value="livraison">
                    <label for="afficherLivraison">Afficher uniquement 'Livraison possible'</label>
                </div>
                <div>
                    <input type="radio" id="afficherTout" name="filtreAnnonce" value="tout" checked>
                    <label for="afficherTout">Afficher toutes les annonces</label>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Ajouter des écouteurs d'événements
        document.getElementById('masquerVenduEtAchat').addEventListener('change', filtrerAnnonces);
        document.getElementById('afficherLivraison').addEventListener('change', filtrerAnnonces);
        document.getElementById('afficherTout').addEventListener('change', filtrerAnnonces);
    }

    // Fonction pour masquer une annonce
    function masquerAnnonce(annonce) {
        annonce.style.display = 'none';
    }

    // Fonction pour réinitialiser l'affichage des annonces
    function reinitialiserAnnonces() {
        const annonces = document.querySelectorAll('a[data-qa-id="aditem_container"]');
        annonces.forEach(annonce => {
            annonce.style.display = ''; // Réinitialiser l'affichage
        });
    }

    // Fonction pour filtrer les annonces
    function filtrerAnnonces() {
        const masquerVenduEtAchat = document.getElementById('masquerVenduEtAchat').checked;
        const afficherLivraison = document.getElementById('afficherLivraison').checked;

        reinitialiserAnnonces(); // Réinitialiser d'abord toutes les annonces

        if (masquerVenduEtAchat || afficherLivraison) {
            const annonces = document.querySelectorAll('a[data-qa-id="aditem_container"]');
            annonces.forEach(annonce => {
                const statutElement = annonce.querySelector('span[data-spark-component="tag"]');
                if (statutElement) {
                    const statut = statutElement.innerText;
                    if (masquerVenduEtAchat && (statut === 'Vendu' || statut === 'Achat en cours')) {
                        masquerAnnonce(annonce);
                    } else if (afficherLivraison && statut !== 'Livraison possible') {
                        masquerAnnonce(annonce);
                    }
                } else if (afficherLivraison) {
                    masquerAnnonce(annonce); // Masquer les annonces sans étiquette de statut
                }
            });
        }
    }

    // Initialiser l'interface et le filtrage au chargement
    window.addEventListener('load', () => {
        creerInterface();
        filtrerAnnonces(); // Appliquer un filtre initial
    });
})();
