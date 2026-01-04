// ==UserScript==
// @name         fc2ppvdb.com to Sukebei Search 2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add Sukebei search links to fc2ppvdb
// @match        https://fc2ppvdb.com/*
// @match        https://db.javfc2.xyz/*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/507517/fc2ppvdbcom%20to%20Sukebei%20Search%202.user.js
// @updateURL https://update.greasyfork.org/scripts/507517/fc2ppvdbcom%20to%20Sukebei%20Search%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extraire l'ID FC2PPV de l'URL
    function extraireFC2PPVID(url) {
        const correspondance = url.match(/\/articles\/(\d+)/);
        return correspondance ? correspondance[1] : null;
    }

    // Générer l'URL de recherche Sukebei
    function genererURLRecherche(id) {
        return `https://sukebei.nyaa.si/?f=0&c=0_0&q=${id}`;
    }

    // Ajouter le lien de recherche sur la page de détails
    function ajouterLienRecherche() {
        if (document.querySelector('#sukebei-search-button')) {
            return;
        }

        const urlActuelle = window.location.href;
        const idFC2PPV = extraireFC2PPVID(urlActuelle);

        if (idFC2PPV) {
            const urlRecherche = genererURLRecherche(idFC2PPV);
            const lienVideoExemple = document.querySelector('a[href^="https://adult.contents.fc2.com/embed/"]');

            if (lienVideoExemple) {
                const boutonRecherche = document.createElement('a');
                boutonRecherche.id = 'sukebei-search-button';
                boutonRecherche.href = urlRecherche;
                boutonRecherche.target = '_blank';
                boutonRecherche.className = 'sukebei-search-link inline-flex items-center mt-2';
                appliquerStyleBouton(boutonRecherche);

                boutonRecherche.innerHTML = `
                    Sukebei
                    <svg class="w-4 h-4 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"></path>
                    </svg>
                `;

                lienVideoExemple.parentNode.insertAdjacentElement('afterend', boutonRecherche);
            }
        }
    }

    // Ajouter les liens de recherche à la grille des vidéos
    function ajouterLiensRechercheGrille() {
        const elements = document.querySelectorAll('[class^="2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/2 p-4"]');

        elements.forEach(element => {
            const span = element.querySelector('span.absolute.top-0.left-0.text-white.bg-gray-800.px-1');
            if (span && !element.querySelector('.sukebei-search-link')) {
                const keyword = span.textContent.trim();
                const searchUrl = genererURLRecherche(keyword);

                const searchLink = document.createElement('a');
                searchLink.href = searchUrl;
                searchLink.target = '_blank';
                searchLink.className = 'sukebei-search-link inline-flex items-center mt-2';
                appliquerStyleBouton(searchLink);

                searchLink.innerHTML = `
                    Sukebei
                    <svg class="w-4 h-4 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"></path>
                    </svg>
                `;

                const mt1Div = element.querySelector('.mt-1');
                if (mt1Div) {
                    mt1Div.appendChild(searchLink);
                }
            }
        });
    }

    // Appliquer le style au bouton
    function appliquerStyleBouton(bouton) {
        bouton.style.color = '#2563eb';
        bouton.style.textDecoration = 'underline';
        bouton.style.display = 'inline-flex';
        bouton.style.alignItems = 'center';
        bouton.style.whiteSpace = 'nowrap';
    }

    // Fonction principale
    function principal() {
        ajouterLienRecherche();
        ajouterLiensRechercheGrille();
    }

    // Observer les changements du DOM et exécuter la fonction principale
    const observateur = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                principal();
            }
        });
    });

    observateur.observe(document.body, { childList: true, subtree: true });

    // Exécuter la fonction principale au chargement initial
    principal();
})();