// ==UserScript==
// @name         fc2ppvdb.com to Sukebei Search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extract FC2PPV ID and search on Sukebei
// @match        https://fc2ppvdb.com/articles/*
// @match        https://db.javfc2.xyz/articles/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506616/fc2ppvdbcom%20to%20Sukebei%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/506616/fc2ppvdbcom%20to%20Sukebei%20Search.meta.js
// ==/UserScript==

(function() {

    'use strict';


    // Fonction pour extraire l'ID FC2PPV

    function extraireFC2PPVID(url) {

        const correspondance = url.match(/\/articles\/(\d+)/);

        return correspondance ? correspondance[1] : null;

    }


    // Fonction pour générer l'URL de recherche

    function genererURLRecherche(id) {

        return `https://sukebei.nyaa.si/?f=0&c=0_0&q=${id}`;

    }


    // Fonction principale

    function principal() {

        // Vérifier si le bouton existe déjà

        if (document.querySelector('#sukebei-search-button')) {

            return; // Terminer si le bouton existe déjà

        }


        const urlActuelle = window.location.href;

        const idFC2PPV = extraireFC2PPVID(urlActuelle);


        if (idFC2PPV) {

            const urlRecherche = genererURLRecherche(idFC2PPV);



            // Chercher le lien de la vidéo d'exemple

            const lienVideoExemple = document.querySelector('a[href^="https://adult.contents.fc2.com/embed/"]');



            if (lienVideoExemple) {

                // Créer le bouton de recherche

                const boutonRecherche = document.createElement('a');

                boutonRecherche.id = 'sukebei-search-button'; // Ajouter un ID

                boutonRecherche.textContent = 'Sukebei';

                boutonRecherche.href = urlRecherche;

                boutonRecherche.target = '_blank';

                boutonRecherche.className = 'inline-flex items-center mt-2';

                boutonRecherche.style.color = '#2563eb'; // Texte bleu

                boutonRecherche.style.textDecoration = 'underline';


                // Ajouter l'icône SVG (même style que les liens existants)

                boutonRecherche.innerHTML += `

                    <svg class="w-4 h-4 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">

                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"></path>

                    </svg>

                `;


                // Insérer le bouton après le lien de la vidéo d'exemple

                lienVideoExemple.parentNode.insertAdjacentElement('afterend', boutonRecherche);

            }

        }

    }


    // Observer les changements du DOM et exécuter la fonction principale lorsque de nouveaux contenus sont ajoutés

    const observateur = new MutationObserver((mutations) => {

        mutations.forEach((mutation) => {

            if (mutation.type === 'childList') {

                principal();

            }

        });

    });


    observateur.observe(document.body, { childList: true, subtree: true });


    // Exécution initiale

    principal();

})();