// ==UserScript==
// @name         TMDb: Titre anglais
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Ajoute le titre anglais sur les pages TMDb
// @author       Invincible812
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @grant        GM_xmlhttpRequest
// @connect      api.themoviedb.org
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/521787/TMDb%3A%20Titre%20anglais.user.js
// @updateURL https://update.greasyfork.org/scripts/521787/TMDb%3A%20Titre%20anglais.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Clé API TMDb
    const apiKey = 'bbae8d96fec747f6373b947cf093d026';

    // Détecter si on est sur une page "movie" ou "tv"
    const pathParts = window.location.pathname.split('/');
    const type = pathParts[1]; // 'movie' ou 'tv'
    const id = pathParts[2];   // ID du film ou de la série

    if (!['movie', 'tv'].includes(type) || !id) {
        console.error('Type ou ID invalide dans l\'URL TMDb.');
        return;
    }

    // URL de l'API pour récupérer les informations (en anglais)
    const apiUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`;

    // Récupérer les informations depuis l'API TMDb
    GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        onload: function(response) {
            if (response.status === 200) {
                const data = JSON.parse(response.responseText);

                // Récupérer le titre anglais
                const englishTitle = type === 'movie' ? data.title : data.name;

                // Vérifier si la section "facts" existe
                const factsSection = document.querySelector('.facts.left_column');
                if (factsSection) {
                    // Créer un élément HTML pour le titre anglais
                    const englishTitleElement = document.createElement('p');
                    englishTitleElement.innerHTML = `<strong><bdi>Titre anglais</bdi></strong> ${englishTitle}    `;

                    // Insérer le titre anglais au début des infos
                    const firstChild = factsSection.firstChild;
                    factsSection.insertBefore(englishTitleElement, firstChild);

                    // Ajouter un bouton "Copier le titre"
                    const copyButton = document.createElement('button');
                    copyButton.textContent = 'Copier le titre';
                    copyButton.style.marginLeft = '13px';
                    copyButton.style.padding = '3px 2px';
                    copyButton.style.cursor = 'pointer';
                    copyButton.style.fontSize = '0.9em';

                    // Ajouter l'événement de clic pour copier le titre
                    copyButton.addEventListener('click', () => {
                        navigator.clipboard.writeText(englishTitle).then(() => {
                            alert('Titre anglais copié dans le presse-papiers !');
                        }).catch(err => {
                            console.error('Erreur lors de la copie dans le presse-papiers :', err);
                        });
                    });

                    // Ajouter le bouton après le titre anglais
                    englishTitleElement.appendChild(copyButton);
                } else {
                    console.error('La section "facts" n\'a pas été trouvée.');
                }
            } else {
                console.error('Erreur lors de la récupération des données TMDb:', response);
            }
        },
        onerror: function(error) {
            console.error('Erreur dans la requête GM_xmlhttpRequest:', error);
        }
    });
})();
