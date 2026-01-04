
// ==UserScript==
// @name         Facebook Cleaner - Block Group Invites & Spam
// @namespace    https://github.com/cadot-eu/facebook-cleaner
// @version      2.0
// @description  Powerful Tampermonkey script to automatically hide Facebook group invitations, spam, and unwanted posts. Customizable, robust, and privacy-friendly. 
// @author       FCB Cleaner Project
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @grant        none
// @run-at       document-end

// @homepageURL  https://github.com/cadot-eu/facebook-cleaner
// @supportURL   https://github.com/cadot-eu/facebook-cleaner/issues
// @icon         https://raw.githubusercontent.com/cadot-eu/facebook-cleaner/main/icon.png
//
// @downloadURL https://update.greasyfork.org/scripts/545074/Facebook%20Cleaner%20-%20Block%20Group%20Invites%20%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/545074/Facebook%20Cleaner%20-%20Block%20Group%20Invites%20%20Spam.meta.js
// ==/UserScript==

/*
*  FCB Cleaner (Facebook Content Blocker)
*  - Instantly blocks Facebook group invites, spam, and unwanted posts.
*  - Customizable: add your own phrases or group/page names to block.
*  - Robust: adapts to Facebook layout changes, cleans up all post fragments.
*  - Privacy-friendly: runs only in your browser, stores nothing online.
*
*  ➡️  To install or update, use the official GreasyFork page:
*  https://greasyfork.org/fr/scripts/545074-facebook-cleaner-block-group-invites-spam
*
*  (Or for manual install: https://github.com/cadot-eu/facebook-cleaner/raw/main/fcb.js)
*
*  📦  GitHub & Documentation:
*  https://github.com/cadot-eu/facebook-cleaner
*/

(function () {
    'use strict';

    // Liste des phrases à bloquer (plus large et flexible)
    let phrasesABloquer = [
        "vous invite",
        "vous a invité",
        "vous a invité.e",
        "invite à rejoindre",
        "a rejoint le groupe",
        "invited you to join",
        "rejoindre ce groupe",
        "rejoindre le groupe",
        "join this group",
        "has joined the group",
        "healthy body"
    ];

    // Récupérer les phrases personnalisées du localStorage
    try {
        const phrasesStockees = localStorage.getItem('fcb-phrases-personnalisees');
        if (phrasesStockees) {
            const phrasesPersonnalisees = JSON.parse(phrasesStockees);
            phrasesABloquer = phrasesABloquer.concat(phrasesPersonnalisees);
        }
    } catch (e) {
        // Erreur silencieuse
    }

    // Fonction pour sauvegarder les phrases personnalisées
    function sauvegarderPhrases() {
        try {
            const phrasesPersonnalisees = phrasesABloquer.slice(11); // Garder seulement les phrases ajoutées (healthy body inclus dans les 11 par défaut)
            localStorage.setItem('fcb-phrases-personnalisees', JSON.stringify(phrasesPersonnalisees));
        } catch (e) {
            // Erreur silencieuse
        }
    }

    let postsTraites = new Set();
    let elementsMarques = new WeakSet(); // Pour éviter de retraiter les mêmes éléments
    let textesBloquesCache = new Set(); // Cache des textes déjà identifiés comme à bloquer

    // État d'activation du script
    let scriptActif = localStorage.getItem('fcb-script-actif') !== 'false'; // Actif par défaut

    // Options du script avec localStorage - chargement robuste
    let options = {
        masquerColonneDroite: false,
        masquerReels: false,
        masquerSuggestions: false,
    };

    // Charger les options de manière robuste
    function chargerOptions() {
        try {
            // Charger chaque option individuellement avec valeur par défaut
            const colonneDroite = localStorage.getItem('fcb-option-colonne-droite');
            const reels = localStorage.getItem('fcb-option-masquer-reels');
            const suggestions = localStorage.getItem('fcb-option-masquer-suggestions');

            options.masquerColonneDroite = colonneDroite === 'true';
            options.masquerReels = reels === 'true';
            options.masquerSuggestions = suggestions === 'true';

        } catch (e) {
            // Garder les valeurs par défaut
        }
    }

    // Charger immédiatement les options
    chargerOptions();

    // Fonction pour sauvegarder les options
    function sauvegarderOptions() {
        localStorage.setItem('fcb-option-colonne-droite', options.masquerColonneDroite);
        localStorage.setItem('fcb-option-masquer-reels', options.masquerReels);
        localStorage.setItem('fcb-option-masquer-suggestions', options.masquerSuggestions);
    }

    // Fonction pour appliquer les modifications CSS selon les options
    function appliquerOptionsCSS() {
        // Supprimer les styles précédents
        const ancienStyle = document.getElementById('fcb-options-styles');
        if (ancienStyle) ancienStyle.remove();

        // Créer un nouveau style
        const style = document.createElement('style');
        style.id = 'fcb-options-styles';
        let css = '';

        if (options.masquerColonneDroite) {
            css += `
                    /* Masquer la colonne de droite */
                    div[role="complementary"] {
                        display: none !important;
                    }
                    
                    /* Agrandir la zone principale pour occuper l'espace libéré */
                    div[role="main"] {
                        max-width: none !important;
                        width: calc(100% - 360px) !important;
                        margin-left: 360px !important;
                        margin-right: 0 !important;
                    }
                    
                    /* Agrandir le conteneur du feed */
                    div[role="feed"] {
                        max-width: none !important;
                        width: 100% !important;
                        padding-right: 20px !important;
                    }
                    
                    /* Ajuster les posts pour qu'ils utilisent toute la largeur disponible */
                    div[role="feed"] > div {
                        max-width: none !important;
                        width: 100% !important;
                    }
                `;
        }

        // CSS pour les boutons de suppression de posts
        css += `
                .fcb-delete-btn {
                    position: absolute !important;
                    top: 10px !important;
                    right: 50px !important;
                    background: rgba(255, 0, 0, 0.8) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 50% !important;
                    width: 24px !important;
                    height: 24px !important;
                    font-size: 14px !important;
                    cursor: pointer !important;
                    z-index: 1000 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-weight: bold !important;
                }
                .fcb-delete-btn:hover {
                    background: rgba(255, 0, 0, 1) !important;
                    transform: scale(1.1) !important;
                }
                
                /* Assurer que les posts ont position relative pour les boutons absolus */
                div[role="article"],
                div[data-pagelet^="FeedUnit"],
                .x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z {
                    position: relative !important;
                }
            `;

        style.textContent = css;
        document.head.appendChild(style);
    }

    function masquerReels() {
        if (!options.masquerReels) return;

        // Sélecteurs pour trouver les éléments contenant "Reels"
        const selecteursReels = [
            'span',
            'h3',
            '[aria-label*="Reels"]',
            '[aria-label*="Bobines"]'
        ];

        // Fonction pour vérifier si un élément contient "Reels"
        function contientReels(element) {
            const texte = element.textContent || element.innerText || '';
            return texte.toLowerCase().includes('reels') ||
                (element.getAttribute && element.getAttribute('aria-label') &&
                    element.getAttribute('aria-label').toLowerCase().includes('reels'));
        }

        // Chercher tous les éléments qui contiennent "Reels"
        const tousLesElements = document.querySelectorAll('span, h3, div[aria-label], div[role="button"]');

        tousLesElements.forEach(element => {
            if (contientReels(element)) {
                // Remonter dans la hiérarchie pour trouver le conteneur principal
                let conteneur = element;
                let niveaux = 0;
                const maxNiveaux = 6;

                // Remonter jusqu'à trouver un conteneur approprié
                while (conteneur && niveaux < maxNiveaux) {
                    // Vérifier si c'est un conteneur de section (avec une taille raisonnable)
                    if (conteneur.offsetHeight > 100 && conteneur.offsetWidth > 200 &&
                        conteneur.children.length >= 2) {

                        // Masquer cet élément
                        conteneur.style.setProperty('display', 'none', 'important');
                        conteneur.style.setProperty('visibility', 'hidden', 'important');
                        conteneur.style.setProperty('height', '0px', 'important');
                        conteneur.style.setProperty('overflow', 'hidden', 'important');
                        conteneur.style.setProperty('opacity', '0', 'important');
                        conteneur.style.setProperty('max-height', '0px', 'important');
                        conteneur.setAttribute('data-reels-hidden', 'true');

                        break;
                    }

                    conteneur = conteneur.parentElement;
                    niveaux++;
                }
            }
        });
    }

    function masquerSuggestions() {
        if (!options.masquerSuggestions) return;

        // Utiliser plusieurs approches pour une détection robuste

        // APPROCHE 1: Utiliser la même logique de détection que pour les posts normaux
        const selecteursPosts = [
            'div[role="article"]',
            'div[data-pagelet^="FeedUnit"]',
            '.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z',
            'div.x1n2onr6.xh8yej3',
            // Nouveaux sélecteurs plus larges
            'div[style*="flex-direction"]:has(.x1vqgdyp)',
            'div:has(h3):has(img)',
            'section > div > div'
        ];

        // APPROCHE 2: Recherche par texte dans tout le DOM
        const phrasesSuggestions = [
            'personnes que vous pourriez connaître',
            'people you may know',
            'vous connaissez peut-être',
            'you might know',
            'suggested for you',
            'suggéré pour vous',
            'amis suggérés',
            'suggested friends',
            'personnes que vous connaissez peut-être',
            'people you might know'
        ];

        // Scanner tous les éléments texte pour détecter les suggestions
        const tousLesElements = document.querySelectorAll('div, section, article, h3, span');

        tousLesElements.forEach(element => {
            if (element.hasAttribute('data-fcb-suggestions-processed')) return;

            const texte = element.textContent || element.innerText || '';
            const texteNormalise = texte.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            // Vérifier si c'est une suggestion
            const estSuggestion = phrasesSuggestions.some(phrase =>
                texteNormalise.includes(phrase.toLowerCase())
            );

            if (estSuggestion) {
                // Remonter pour trouver le conteneur principal du post
                let conteneur = element;
                let niveaux = 0;
                const maxNiveaux = 10;

                while (conteneur && niveaux < maxNiveaux) {
                    // Critères pour identifier un conteneur de suggestions
                    const estConteneurSuggestions = (
                        conteneur.offsetHeight > 100 &&
                        conteneur.offsetHeight < 2000 &&
                        conteneur.offsetWidth > 200 &&
                        conteneur.children.length >= 2 &&
                        !conteneur.hasAttribute('data-fcb-suggestions-processed')
                    );

                    if (estConteneurSuggestions) {
                        // Marquer comme traité
                        conteneur.setAttribute('data-fcb-suggestions-processed', 'true');

                        // Masquer complètement le conteneur
                        conteneur.style.setProperty('display', 'none', 'important');
                        conteneur.style.setProperty('visibility', 'hidden', 'important');
                        conteneur.style.setProperty('height', '0px', 'important');
                        conteneur.style.setProperty('overflow', 'hidden', 'important');
                        conteneur.style.setProperty('opacity', '0', 'important');
                        conteneur.style.setProperty('max-height', '0px', 'important');
                        conteneur.setAttribute('data-fcb-hidden', 'suggestions');

                        break;
                    }

                    conteneur = conteneur.parentElement;
                    niveaux++;
                }

                // Marquer l'élément initial comme traité même si on n'a pas trouvé de conteneur
                element.setAttribute('data-fcb-suggestions-processed', 'true');
            }
        });

        // APPROCHE 3: Scanner les posts normaux qui pourraient contenir des suggestions
        selecteursPosts.forEach(selecteur => {
            try {
                const posts = document.querySelectorAll(selecteur);

                posts.forEach(post => {
                    if (post.hasAttribute('data-fcb-suggestions-processed')) return;

                    const textePost = post.textContent || post.innerText || '';
                    const texteNormalise = textePost.toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();

                    // Vérifier si c'est une suggestion
                    const estSuggestion = phrasesSuggestions.some(phrase =>
                        texteNormalise.includes(phrase.toLowerCase())
                    );

                    if (estSuggestion) {
                        // Marquer comme traité
                        post.setAttribute('data-fcb-suggestions-processed', 'true');

                        // Masquer complètement le post
                        post.style.setProperty('display', 'none', 'important');
                        post.style.setProperty('visibility', 'hidden', 'important');
                        post.style.setProperty('height', '0px', 'important');
                        post.style.setProperty('overflow', 'hidden', 'important');
                        post.style.setProperty('opacity', '0', 'important');
                        post.style.setProperty('max-height', '0px', 'important');
                        post.setAttribute('data-fcb-hidden', 'suggestions');
                    }
                });
            } catch (e) {
                // Erreur silencieuse
            }
        });
    }

    // Fonction pour ajouter des boutons de suppression sur les posts
    function ajouterBoutonsSuppressionPosts() {
        const selecteursPosts = [
            'div[role="article"]',
            'div[data-pagelet^="FeedUnit"]',
            '.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z'
        ];

        selecteursPosts.forEach(selecteur => {
            const posts = document.querySelectorAll(selecteur);

            posts.forEach(post => {
                // Vérifier si le bouton n'existe pas déjà
                if (post.querySelector('.fcb-delete-btn')) return;

                // Trouver le titre du post pour créer le bouton
                const titreSelectors = [
                    'h3',
                    '[role="heading"]',
                    '.x1heor9g',
                    '.x1qlqyl8',
                    'span[dir="ltr"]:first-child'
                ];

                let titreElement = null;
                for (const selector of titreSelectors) {
                    titreElement = post.querySelector(selector);
                    if (titreElement && titreElement.textContent.trim().length > 5) {
                        break;
                    }
                }

                if (titreElement) {
                    let titre = titreElement.textContent.trim();
                    // Échapper les caractères spéciaux
                    titre = titre.replace(/['"\\]/g, ' ').trim();
                    if (titre.length > 5) { // Seulement si le titre a du contenu
                        // Créer le bouton de suppression
                        const boutonSupprimer = document.createElement('button');
                        boutonSupprimer.className = 'fcb-delete-btn';
                        boutonSupprimer.innerHTML = '×';
                        boutonSupprimer.title = `Ajouter "${titre}" aux phrases bloquées`;

                        boutonSupprimer.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            // Ajouter le titre aux phrases bloquées
                            if (!phrasesABloquer.includes(titre)) {
                                phrasesABloquer.push(titre);
                                sauvegarderPhrases();

                                // Masquer immédiatement le post
                                post.style.display = 'none';

                                // Notification
                                alert(`Phrase "${titre}" ajoutée aux blocages !`);

                                // Relancer le scan pour masquer d'autres posts similaires
                                setTimeout(scannerPosts, 100);
                            }
                        });

                        // Ajouter le bouton au post
                        post.style.position = 'relative';
                        post.appendChild(boutonSupprimer);
                    }
                }
            });
        });
    }

    function contientPhraseBloquee(texte) {
        const texteNormalise = texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return phrasesABloquer.some(phrase =>
            texteNormalise.includes(phrase.toLowerCase())
        );
    }

    function ajouterBoutonAuPost(element) {
        // Éviter d'ajouter plusieurs boutons au même post
        if (element.querySelector('.fcb-add-title-btn')) return;

        // Ne pas ajouter de bouton aux posts déjà masqués
        if (element.hasAttribute('data-blocked-by-script') ||
            element.style.display === 'none' ||
            element.style.visibility === 'hidden') return;

        // Chercher le conteneur de titre pour le placement
        const conteneurTitre = element.querySelector('div[data-ad-rendering-role="profile_name"], h4, .x1heor9g');
        if (!conteneurTitre) return;

        // Extraire le titre/nom du groupe ou de la page dans ce post spécifique
        const titre = extraireTitrePost(element);
        if (!titre || phrasesABloquer.includes(titre)) return;

        // Créer le bouton d'ajout
        const boutonAjouter = document.createElement('button');
        boutonAjouter.className = 'fcb-add-title-btn';
        boutonAjouter.innerHTML = '×';
        boutonAjouter.title = `Bloquer: "${titre}"`;
        boutonAjouter.style.cssText = `
                background: rgba(220, 38, 38, 0.9);
                color: white;
                border: none;
                padding: 2px 6px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                opacity: 0.8;
                transition: all 0.2s;
                z-index: 10;
                margin-left: 8px;
                vertical-align: middle;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 18px;
                height: 18px;
            `;

        boutonAjouter.onmouseover = () => {
            boutonAjouter.style.opacity = '1';
            boutonAjouter.style.transform = 'scale(1.1)';
            boutonAjouter.style.background = 'rgba(220, 38, 38, 1)';
        };
        boutonAjouter.onmouseout = () => {
            boutonAjouter.style.opacity = '0.8';
            boutonAjouter.style.transform = 'scale(1)';
            boutonAjouter.style.background = 'rgba(220, 38, 38, 0.9)';
        };

        boutonAjouter.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Interface simple avec prompt pour test
            const titreFinal = prompt(
                `Titre détecté :\n"${titre}"\n\nVous pouvez le modifier avant de l'ajouter aux phrases bloquées :\n(Cliquez Annuler pour ne rien faire)`,
                titre
            );

            // Si l'utilisateur a annulé
            if (titreFinal === null) {
                return;
            }

            // Si le champ est vide
            if (!titreFinal.trim()) {
                alert('Le titre ne peut pas être vide');
                return;
            }

            const titreClean = titreFinal.trim();

            // Vérifier si déjà dans la liste
            if (phrasesABloquer.includes(titreClean)) {
                alert(`"${titreClean}" est déjà dans la liste des phrases bloquées !`);
                return;
            }

            // Ajouter à la liste
            phrasesABloquer.push(titreClean);
            sauvegarderPhrases();

            // Feedback visuel
            boutonAjouter.innerHTML = '✅';
            boutonAjouter.style.background = 'rgba(16, 185, 129, 1)';
            boutonAjouter.title = `Ajouté : "${titreClean}"`;

            // Message de confirmation
            alert(`"${titreClean}" a été ajouté aux phrases bloquées !`);

            // Supprimer le bouton et re-scanner
            setTimeout(() => {
                boutonAjouter.remove();
                setTimeout(scannerPosts, 100);
            }, 1000);
        };

        // Trouver l'élément de titre et ajouter le bouton juste après
        const elementTitre = conteneurTitre.querySelector('strong, b, a[role="link"]');
        if (elementTitre && elementTitre.parentNode) {
            // Insérer le bouton directement après l'élément de titre
            elementTitre.parentNode.insertBefore(boutonAjouter, elementTitre.nextSibling);
        } else {
            // Fallback : ajouter à la fin du conteneur de titre
            conteneurTitre.appendChild(boutonAjouter);
        }
    }

    function extraireTitrePost(postElement) {
        // Sélecteurs spécifiques pour extraire seulement le nom/titre
        const selecteurs = [
            // Sélecteur principal pour le nom d'auteur basé sur votre exemple
            'div[data-ad-rendering-role="profile_name"] strong',
            'div[data-ad-rendering-role="profile_name"] b',
            'div[data-ad-rendering-role="profile_name"] a strong',
            'div[data-ad-rendering-role="profile_name"] a b',
            'h4 span span span a strong',
            'h4 span span span a b',
            // Fallbacks
            'h4 a[role="link"] strong',
            'h4 a[role="link"] b',
            'span[class*="x1vvkbs"] a[role="link"] strong',
            'span[class*="x1vvkbs"] a[role="link"] b',
            'h4 span a[role="link"]',
            'strong a[role="link"]'
        ];

        for (const selecteur of selecteurs) {
            const elements = postElement.querySelectorAll(selecteur);
            for (const element of elements) {
                let texte = element.textContent || element.innerText || '';
                texte = texte.trim();

                // Nettoyer AVANT la validation - ordre important !
                texte = texte.replace(/\s*·.*$/g, ''); // Supprimer tout après le premier ·
                texte = texte.replace(/\s*Compte vérifié\s*/gi, ''); // Supprimer "Compte vérifié"
                texte = texte.replace(/\s*Verified\s*/gi, ''); // Supprimer "Verified"
                texte = texte.replace(/\s*Suivre\s*$/gi, ''); // Supprimer "Suivre" à la fin
                texte = texte.replace(/\s*Follow\s*$/gi, ''); // Supprimer "Follow" à la fin
                texte = texte.replace(/\s*\.\s*Suivre\s*$/gi, ''); // Supprimer ". Suivre"
                texte = texte.replace(/\s*\.\s*Follow\s*$/gi, ''); // Supprimer ". Follow"
                // Supprimer les badges de vérification avec différentes variantes
                texte = texte.replace(/Compte vérifié/gi, '');
                texte = texte.replace(/Verified/gi, '');
                // Nettoyer les espaces multiples
                texte = texte.replace(/\s+/g, ' ').trim();

                // Valider que c'est un titre valide après nettoyage
                if (texte &&
                    texte.length > 2 &&
                    texte.length < 80 &&
                    !texte.includes('ago') &&
                    !texte.includes('il y a') &&
                    !texte.includes('min') &&
                    !texte.includes('h ') &&
                    !texte.includes('Suivre') &&
                    !texte.includes('Follow') &&
                    !texte.includes('Compte vérifié') &&
                    !texte.includes('Verified') &&
                    !texte.match(/^\d+$/) &&
                    !texte.match(/^[.,:;!?·]+$/)) {

                    // Double nettoyage pour s'assurer que tout est propre
                    texte = texte.replace(/Compte vérifié/gi, '');
                    texte = texte.replace(/Verified/gi, '');
                    texte = texte.replace(/\s+/g, ' ').trim();

                    // Échapper les caractères spéciaux qui pourraient causer des erreurs JS
                    texte = texte.replace(/['"\\]/g, ' ').replace(/\s+/g, ' ').trim();

                    if (texte.length > 2) {
                        return texte;
                    }
                }
            }
        }

        return null;
    }

    function masquerPost(element) {
        if (!element || elementsMarques.has(element)) return false;
        // Sécurité : ne jamais masquer <body> ou <html>
        if (element === document.body || element === document.documentElement) {
            return false;
        }
        // Marquage permanent
        element.setAttribute('data-blocked-by-script', 'true');
        element.classList.add('script-blocked-post');
        elementsMarques.add(element);

        // Styles de masquage multiples pour résistance
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('height', '0px', 'important');
        element.style.setProperty('overflow', 'hidden', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('max-height', '0px', 'important');

        // Observer si l'élément est modifié pour le re-masquer
        const elementObserver = new MutationObserver(function () {
            if (element.style.display !== 'none') {
                element.style.setProperty('display', 'none', 'important');
                element.style.setProperty('visibility', 'hidden', 'important');
            }
        });

        elementObserver.observe(element, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        return true;
    }

    function trouverPostParent(element) {
        // APPROCHE SIMPLIFIÉE : avec les menus actions, on a déjà de bons conteneurs
        // Cette fonction ne fait plus que des vérifications de sécurité basiques

        // Sécurités de base
        if (!element || element === document.body || element === document.documentElement) {
            return null;
        }

        // Si l'élément a déjà une taille raisonnable, on le garde
        if (element.offsetHeight > 80 && element.offsetHeight < 800 &&
            element.offsetWidth > 300 && element.children.length <= 20) {
            return element;
        }

        // Sinon, remonter juste un niveau pour améliorer
        const parent = element.parentElement;
        if (parent && parent !== document.body && parent !== document.documentElement &&
            parent.offsetHeight > element.offsetHeight &&
            parent.offsetHeight < 1000 &&
            parent.offsetWidth < window.innerWidth * 0.8) {

            return parent;
        }

        return element; // Retourner l'élément original si pas d'amélioration
    }

    function scannerPosts() {
        // Vérifier si le script est actif
        if (!scriptActif) {
            return;
        }

        // D'abord, re-masquer tous les posts déjà identifiés comme bloqués
        document.querySelectorAll('[data-blocked-by-script="true"]').forEach(element => {
            if (element.style.display !== 'none') {
                element.style.setProperty('display', 'none', 'important');
                element.style.setProperty('visibility', 'hidden', 'important');
            }
        });

        // NOUVELLE APPROCHE : Utiliser les menus "trois points" comme indicateurs de posts
        const tousLesElements = new Set();

        // 1. Chercher tous les boutons de menu "Actions pour cette publication"
        const menusActions = document.querySelectorAll('div[aria-label*="Actions pour cette publication"], div[aria-label*="Actions for this post"], div[role="button"][aria-haspopup="menu"]:not([data-blocked-by-script="true"])');

        menusActions.forEach(menu => {
            // Remonter dans la hiérarchie pour trouver le conteneur du post
            let conteneurPost = menu;
            let niveaux = 0;
            const maxNiveaux = 8; // Chercher jusqu'à 8 niveaux

            while (conteneurPost && niveaux < maxNiveaux) {
                // Critères pour identifier un conteneur de post valide
                const estConteneurPost = (
                    conteneurPost.offsetHeight > 100 && // Au moins 100px de haut
                    conteneurPost.offsetHeight < 1200 && // Pas plus de 1200px
                    conteneurPost.offsetWidth > 300 && // Au moins 300px de large
                    conteneurPost.textContent.length > 50 && // Contenu substantiel
                    conteneurPost.children.length >= 2 && // Au moins 2 enfants
                    conteneurPost.children.length <= 30 // Pas plus de 30 enfants
                );

                if (estConteneurPost) {
                    const texte = conteneurPost.textContent || '';
                    if (contientPhraseBloquee(texte)) {
                        tousLesElements.add(conteneurPost);
                        break; // Sortir de la boucle une fois qu'on a trouvé le bon conteneur
                    }
                }

                conteneurPost = conteneurPost.parentElement;
                niveaux++;
            }
        });

        // 2. Méthode de fallback : Scanner les sélecteurs classiques
        const selecteursFallback = [
            'div[role="article"]:not([data-blocked-by-script="true"])',
            'div[data-testid]:not([data-blocked-by-script="true"])',
            'div[data-pagelet*="FeedUnit"]:not([data-blocked-by-script="true"])'
        ];

        selecteursFallback.forEach(selecteur => {
            try {
                const elements = document.querySelectorAll(selecteur);

                elements.forEach(el => {
                    if (el.offsetHeight > 50 && el.offsetHeight < 1000 &&
                        el.offsetWidth > 200 && el.textContent.length > 20) {

                        // Ajouter le bouton d'ajout même pour les posts non bloqués
                        ajouterBoutonAuPost(el);

                        const texte = el.textContent || '';
                        if (contientPhraseBloquee(texte)) {
                            tousLesElements.add(el);
                        }
                    }
                });
            } catch (e) {
                // Erreur silencieuse
            }
        });

        // Traiter chaque élément trouvé
        let postsMasques = 0;
        tousLesElements.forEach(element => {
            // Éviter les éléments déjà traités
            if (elementsMarques.has(element)) return;

            // Ajouter le bouton d'ajout à ce post (avant de vérifier s'il doit être masqué)
            ajouterBoutonAuPost(element);

            const texte = element.textContent || element.innerText || '';

            if (texte && contientPhraseBloquee(texte)) {
                const texteSignature = texte.substring(0, 100);

                // Masquer directement l'élément trouvé (déjà optimisé via les menus)
                if (masquerPost(element)) {
                    postsMasques++;
                    postsTraites.add(texteSignature);
                } else {
                    // Échec du masquage
                }
            }
        });

        // Masquer les Reels si l'option est activée
        masquerReels();

        // Masquer les suggestions si l'option est activée
        masquerSuggestions();

        // Ajouter les boutons de suppression sur tous les posts
        ajouterBoutonsSuppressionPosts();
    }

    function nettoyerElementsOrphelins() {
        // NETTOYAGE TRÈS LIMITÉ - seulement les "En voir plus" évidents
        const elementsEnVoirPlus = document.querySelectorAll('div[role="button"]:not([data-blocked-by-script="true"])');
        elementsEnVoirPlus.forEach(element => {
            const texte = element.textContent || '';
            if ((texte.trim() === 'En voir plus' || texte.trim() === 'See more') && texte.length < 20) {
                // Vérifier si cet élément appartient à un post qui devrait être bloqué
                let parent = element.parentElement;
                let niveaux = 0;

                while (parent && niveaux < 3) { // Seulement 3 niveaux max
                    const texteParent = parent.textContent || '';
                    if (texteParent && contientPhraseBloquee(texteParent) &&
                        parent.getAttribute('role') === 'article') { // DOIT être un article
                        masquerPost(element);
                        break;
                    }
                    parent = parent.parentElement;
                    niveaux++;
                }
            }
        });
    }

    // Observer très réactif pour les changements
    const observer = new MutationObserver(function (mutations) {
        let nouveauxPosts = false;

        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        (node.textContent.length > 10 || node.querySelector('div'))) {
                        nouveauxPosts = true;
                    }
                });
            }
        });

        if (nouveauxPosts) {
            // Vérifier si le script est actif avant de scanner
            if (!scriptActif) return;

            // Scanner immédiatement et plusieurs fois
            setTimeout(scannerPosts, 10);
            setTimeout(scannerPosts, 100);
            setTimeout(scannerPosts, 500);
            // Ajouter le nettoyage des orphelins
            setTimeout(nettoyerElementsOrphelins, 200);
            setTimeout(nettoyerElementsOrphelins, 600);
            // Masquer les Reels
            setTimeout(masquerReels, 150);
            setTimeout(masquerReels, 400);
            // Masquer les suggestions
            setTimeout(masquerSuggestions, 200);
            setTimeout(masquerSuggestions, 500);
        }
    });

    function initialiser() {
        // Vérifier si le script est actif
        if (!scriptActif) {
            return;
        }

        // Scanner initial multiple
        setTimeout(scannerPosts, 100);
        setTimeout(scannerPosts, 500);
        setTimeout(scannerPosts, 1000);
        setTimeout(scannerPosts, 2000);
        setTimeout(scannerPosts, 5000);

        // Masquage initial des Reels
        setTimeout(masquerReels, 200);
        setTimeout(masquerReels, 800);
        setTimeout(masquerReels, 2000);

        // Masquage initial des suggestions
        setTimeout(masquerSuggestions, 300);
        setTimeout(masquerSuggestions, 900);
        setTimeout(masquerSuggestions, 2200);

        // Ajouter les boutons de suppression initiaux
        setTimeout(ajouterBoutonsSuppressionPosts, 400);
        setTimeout(ajouterBoutonsSuppressionPosts, 1000);
        setTimeout(ajouterBoutonsSuppressionPosts, 2500);

        // Nettoyage des orphelins
        setTimeout(nettoyerElementsOrphelins, 300);
        setTimeout(nettoyerElementsOrphelins, 1200);
        setTimeout(nettoyerElementsOrphelins, 3000);

        // Observer les changements
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Scanner très fréquent au début puis moins
        let scanCount = 0;
        const intervalId = setInterval(() => {
            if (!scriptActif) {
                clearInterval(intervalId);
                return;
            }
            scannerPosts();
            setTimeout(nettoyerElementsOrphelins, 100);
            setTimeout(masquerReels, 100);
            setTimeout(masquerSuggestions, 100);
            setTimeout(ajouterBoutonsSuppressionPosts, 150);
            scanCount++;
            if (scanCount > 20) {
                clearInterval(intervalId);
                // Passer à un scanner moins fréquent
                setInterval(() => {
                    if (scriptActif) {
                        scannerPosts();
                        setTimeout(nettoyerElementsOrphelins, 100);
                        setTimeout(masquerReels, 100);
                        setTimeout(masquerSuggestions, 100);
                        setTimeout(ajouterBoutonsSuppressionPosts, 150);
                    }
                }, 5000);
            }
        }, 1000);

        // Scanner au scroll plus réactif
        let scrollTimeout;
        let lastScrollTop = 0;
        window.addEventListener('scroll', function () {
            if (!scriptActif) return;

            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (Math.abs(currentScrollTop - lastScrollTop) > 100) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    scannerPosts();
                    setTimeout(masquerReels, 50);
                    setTimeout(masquerSuggestions, 50);
                    lastScrollTop = currentScrollTop;
                }, 100);
            }
        });
    }

    // Interface utilisateur améliorée
    function creerInterface() {
        const container = document.createElement('div');
        container.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                z-index: 10000;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                display: flex;
                gap: 5px;
                align-items: center;
            `;

        const boutonOnOff = document.createElement('button');
        boutonOnOff.innerHTML = scriptActif ? '🟢' : '🔴';
        boutonOnOff.title = scriptActif ? 'Filtres activés - Cliquer pour désactiver' : 'Filtres désactivés - Cliquer pour activer';
        boutonOnOff.style.cssText = `
                background: ${scriptActif ? '#10b981' : '#ef4444'};
                color: white;
                border: none;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;

        const boutonAjouter = document.createElement('button');
        boutonAjouter.innerHTML = '➕';
        boutonAjouter.title = 'Ajouter une phrase à bloquer';
        boutonAjouter.style.cssText = `
                background: #1877f2;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;



        const boutonVoir = document.createElement('button');
        boutonVoir.innerHTML = '👁️';
        boutonVoir.title = 'Voir et gérer les phrases bloquées';
        boutonVoir.style.cssText = `
                background: #8b5cf6;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;

        const boutonOptions = document.createElement('button');
        boutonOptions.innerHTML = '⚙️';
        boutonOptions.title = 'Options et paramètres';
        boutonOptions.style.cssText = `
                background: #6366f1;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;

        const compteur = document.createElement('div');
        compteur.innerHTML = postsTraites.size;
        compteur.title = 'Nombre de posts bloqués';
        compteur.style.cssText = `
                background: #dc2626;
                color: white;
                padding: 4px 8px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: bold;
                min-width: 16px;
                text-align: center;
            `;

        boutonOnOff.onclick = function () {
            // Basculer l'état
            scriptActif = !scriptActif;

            // Sauvegarder dans localStorage
            localStorage.setItem('fcb-script-actif', scriptActif.toString());

            // Feedback visuel immédiat
            boutonOnOff.innerHTML = scriptActif ? '🟢' : '🔴';
            boutonOnOff.title = scriptActif ? 'Filtres activés - Cliquer pour désactiver' : 'Filtres désactivés - Cliquer pour activer';
            boutonOnOff.style.background = scriptActif ? '#10b981' : '#ef4444';

            // Animation de feedback
            boutonOnOff.style.transform = 'scale(0.9)';
            setTimeout(() => {
                boutonOnOff.style.transform = 'scale(1)';
            }, 150);

            // Message utilisateur
            const message = scriptActif ? 'Filtres ACTIVÉS 🟢' : 'Filtres DÉSACTIVÉS 🔴';

            // Petite notification visuelle
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: ${scriptActif ? '#10b981' : '#ef4444'};
                    color: white;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 99999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    animation: fadeInOut 2s ease-in-out;
                `;

            // Ajouter l'animation CSS
            const style = document.createElement('style');
            style.textContent = `
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    }
                `;
            document.head.appendChild(style);
            document.body.appendChild(notification);

            // Supprimer la notification après l'animation
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 2000);

            // Rafraîchir la page après un court délai
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        };

        boutonAjouter.onclick = function () {
            const nouvellePh = prompt('Ajouter une phrase à bloquer:', '');
            if (nouvellePh && nouvellePh.trim()) {
                const phrase = nouvellePh.trim();

                if (!phrasesABloquer.includes(phrase)) {
                    phrasesABloquer.push(phrase);
                    sauvegarderPhrases();
                    alert(`Phrase ajoutée: ${phrase}`);
                    elementsMarques = new WeakSet();
                    scannerPosts();
                } else {
                    alert('Cette phrase existe déjà');
                }
            }
        };



        boutonOptions.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
                creerMenuOptions();
            }, 100);
        };

        boutonVoir.onclick = function (e) {
            // Empêcher la propagation de l'événement
            e.preventDefault();
            e.stopPropagation();

            // Créer une fenêtre modale pour afficher les phrases avec boutons de suppression
            setTimeout(() => {
                creerFenetreGestion();
            }, 100);
        };

        container.appendChild(boutonOnOff);
        container.appendChild(boutonAjouter);
        container.appendChild(boutonVoir);
        container.appendChild(boutonOptions);
        container.appendChild(compteur);

        document.body.appendChild(container);

        // Mettre à jour le compteur régulièrement
        setInterval(() => {
            compteur.innerHTML = postsTraites.size;
        }, 2000);
    }

    function extraireTitrePage() {
        const titres = new Set();

        // Sélecteurs pour différents types de titres Facebook
        const selecteursTitres = [
            // Titres de groupes dans les posts
            'span[class*="x1vvkbs"]:not([data-blocked-by-script="true"])',
            'h4 span:not([data-blocked-by-script="true"])',
            'a[role="link"] span:not([data-blocked-by-script="true"])',

            // Titres de pages dans les posts
            'div[data-ad-rendering-role="profile_name"] span:not([data-blocked-by-script="true"])',
            'h4[class*="x14z9mp"] span:not([data-blocked-by-script="true"])',

            // Liens vers des groupes/pages
            'a[href*="/groups/"] span:not([data-blocked-by-script="true"])',
            'a[href*="/pages/"] span:not([data-blocked-by-script="true"])',

            // Sélecteurs génériques pour les noms d'entités
            '[aria-label]:not([data-blocked-by-script="true"])',
        ];

        selecteursTitres.forEach(selecteur => {
            try {
                const elements = document.querySelectorAll(selecteur);
                elements.forEach(element => {
                    let texte = '';

                    // Extraire le texte selon le type d'élément
                    if (element.hasAttribute('aria-label')) {
                        texte = element.getAttribute('aria-label');
                    } else {
                        texte = element.textContent || element.innerText || '';
                    }

                    // Nettoyer et valider le texte
                    texte = texte.trim();
                    if (texte &&
                        texte.length > 3 &&
                        texte.length < 100 &&
                        !texte.includes('·') &&
                        !texte.includes('ago') &&
                        !texte.includes('il y a') &&
                        !texte.includes('Posted') &&
                        !texte.includes('Publié') &&
                        !texte.match(/^\d+$/) && // Pas juste des chiffres
                        !texte.match(/^[.,:;!?]+$/) && // Pas juste de la ponctuation
                        !phrasesABloquer.includes(texte) // Pas déjà dans la liste
                    ) {
                        // Vérifier si c'est probablement un nom de groupe/page
                        const estProbablementUnTitre = (
                            texte.includes(' ') || // Au moins deux mots
                            texte.match(/^[A-Z]/) || // Commence par une majuscule
                            texte.length > 15 // Assez long pour être descriptif
                        );

                        if (estProbablementUnTitre) {
                            titres.add(texte);
                        }
                    }
                });
            } catch (e) {
                // Erreur silencieuse
            }
        });

        // Recherche spécifique pour l'exemple donné
        try {
            const selecteurSpecifique = 'span.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs';
            const elementsSpecifiques = document.querySelectorAll(selecteurSpecifique);
            elementsSpecifiques.forEach(el => {
                const texte = el.textContent?.trim();
                if (texte && texte.length > 10 && !titres.has(texte)) {
                    titres.add(texte);
                }
            });
        } catch (e) {
            // Erreur silencieuse
        }

        return Array.from(titres).slice(0, 10); // Limiter à 10 résultats
    }

    // Fonction pour créer le menu d'options
    function creerMenuOptions() {
        // Recharger les options à chaque ouverture du menu pour synchronisation
        chargerOptions();

        // Supprimer le menu existant si il existe
        const existant = document.getElementById('fcb-options-modal');
        if (existant) existant.remove();

        const modal = document.createElement('div');
        modal.id = 'fcb-options-modal';
        modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 99999;
                display: flex;
                justify-content: center;
                align-items: center;
            `;

        const contenu = document.createElement('div');
        contenu.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 10px;
                max-width: 500px;
                max-height: 80%;
                overflow-y: auto;
                color: black;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            `;

        const titre = document.createElement('h3');
        titre.textContent = '⚙️ Options et Paramètres';
        titre.style.cssText = 'margin-top: 0; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;';

        // Section options d'interface
        const sectionInterface = document.createElement('div');
        sectionInterface.innerHTML = '<h4 style="color: #666; margin-bottom: 15px; margin-top: 20px;">🖥️ Interface Facebook:</h4>';

        // Option supprimer colonne droite
        const optionColonneDroite = creerOptionCheckbox(
            'Masquer la colonne de droite',
            'Supprime la colonne de droite (publicités, suggestions) et agrandit le feed principal',
            options.masquerColonneDroite,
            (checked) => {
                const ancienneValeur = options.masquerColonneDroite;
                options.masquerColonneDroite = checked;
                sauvegarderOptions();

                // Feedback visuel
                const feedback = document.createElement('div');
                feedback.textContent = checked ? '✅ Colonne droite masquée' : '❌ Colonne droite restaurée';
                feedback.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: ${checked ? '#10b981' : '#ef4444'};
                        color: white;
                        padding: 10px 20px;
                        border-radius: 8px;
                        z-index: 100000;
                        font-weight: bold;
                    `;
                document.body.appendChild(feedback);

                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.parentNode.removeChild(feedback);
                    }
                }, 2000);

                // Seulement appliquer le CSS immédiatement
                if (ancienneValeur !== checked) {
                    // Appliquer immédiatement le changement CSS
                    appliquerOptionsCSS();

                    // Feedback
                    feedback.textContent += ' - Appliqué !';
                }
            }
        );

        // Option masquer Reels
        const optionMasquerReels = creerOptionCheckbox(
            'Masquer les Reels',
            'Cache complètement les sections Reels de Facebook pour un feed plus épuré',
            options.masquerReels,
            (checked) => {
                options.masquerReels = checked;
                sauvegarderOptions();

                // Feedback visuel
                const feedback = document.createElement('div');
                feedback.textContent = checked ? '✅ Reels masqués' : '❌ Reels restaurés';
                feedback.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: ${checked ? '#10b981' : '#ef4444'};
                        color: white;
                        padding: 10px 20px;
                        border-radius: 8px;
                        z-index: 100000;
                        font-weight: bold;
                    `;
                document.body.appendChild(feedback);

                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.parentNode.removeChild(feedback);
                    }
                }, 2000);

                // Appliquer immédiatement les changements sans recharger la page
                if (checked) {
                    // Activer le masquage des Reels immédiatement
                    setTimeout(masquerReels, 100);
                    setTimeout(masquerReels, 500); // Double appel pour être sûr
                } else {
                    // Restaurer les Reels en supprimant les masquages
                    document.querySelectorAll('[data-reels-hidden="true"]').forEach(element => {
                        element.style.removeProperty('display');
                        element.style.removeProperty('visibility');
                        element.style.removeProperty('height');
                        element.style.removeProperty('overflow');
                        element.style.removeProperty('opacity');
                        element.style.removeProperty('max-height');
                        element.removeAttribute('data-reels-hidden');
                    });
                }
            }
        );

        // Option masquer suggestions
        const optionMasquerSuggestions = creerOptionCheckbox(
            'Masquer les suggestions d\'amis',
            'Cache les sections "Personnes que vous pourriez connaître" pour un feed plus épuré',
            options.masquerSuggestions,
            (checked) => {
                options.masquerSuggestions = checked;
                sauvegarderOptions();

                // Feedback visuel
                const feedback = document.createElement('div');
                feedback.textContent = checked ? '✅ Suggestions masquées' : '❌ Suggestions restaurées';
                feedback.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: ${checked ? '#10b981' : '#ef4444'};
                        color: white;
                        padding: 10px 20px;
                        border-radius: 8px;
                        z-index: 100000;
                        font-weight: bold;
                    `;
                document.body.appendChild(feedback);

                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.parentNode.removeChild(feedback);
                    }
                }, 2000);

                // Appliquer immédiatement les changements sans recharger la page
                if (checked) {
                    // Activer le masquage des suggestions immédiatement
                    setTimeout(masquerSuggestions, 100);
                    setTimeout(masquerSuggestions, 500); // Double appel pour être sûr
                } else {
                    // Restaurer les suggestions en supprimant les masquages
                    document.querySelectorAll('[data-suggestions-hidden="true"]').forEach(element => {
                        element.style.removeProperty('display');
                        element.style.removeProperty('visibility');
                        element.style.removeProperty('height');
                        element.style.removeProperty('overflow');
                        element.style.removeProperty('opacity');
                        element.style.removeProperty('max-height');
                        element.removeAttribute('data-suggestions-hidden');
                    });
                }
            }
        );

        sectionInterface.appendChild(optionColonneDroite);
        sectionInterface.appendChild(optionMasquerReels);
        sectionInterface.appendChild(optionMasquerSuggestions);

        // Section futures options (pour l'extensibilité)
        const sectionAutres = document.createElement('div');
        sectionAutres.innerHTML = '<h4 style="color: #666; margin-bottom: 15px; margin-top: 20px;">🔮 Futures options:</h4>';

        const infoFutures = document.createElement('p');
        infoFutures.textContent = 'D\'autres options d\'interface et de filtrage seront ajoutées ici.';
        infoFutures.style.cssText = 'color: #999; font-style: italic; margin: 10px 0;';
        sectionAutres.appendChild(infoFutures);

        const boutonFermer = document.createElement('button');
        boutonFermer.textContent = '✖️ Fermer les options';
        boutonFermer.style.cssText = `
                background: #dc2626;
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 25px;
                width: 100%;
                font-size: 14px;
                font-weight: bold;
                transition: background-color 0.2s;
            `;

        boutonFermer.onmouseover = () => {
            boutonFermer.style.background = '#b91c1c';
        };
        boutonFermer.onmouseout = () => {
            boutonFermer.style.background = '#dc2626';
        };

        boutonFermer.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            modal.remove();
        };

        contenu.appendChild(titre);
        contenu.appendChild(sectionInterface);
        contenu.appendChild(sectionAutres);
        contenu.appendChild(boutonFermer);
        modal.appendChild(contenu);

        // Empêcher la fermeture accidentelle
        contenu.onclick = (e) => {
            e.stopPropagation();
        };

        // Fermer SEULEMENT en cliquant à l'extérieur (pas sur le contenu)
        let modalPeutFermer = false;
        setTimeout(() => {
            modalPeutFermer = true;
        }, 500); // Délai plus long pour éviter les clics accidentels

        modal.onclick = (e) => {
            // Fermer SEULEMENT si on clique sur l'arrière-plan noir (pas sur le contenu)
            if (e.target === modal && modalPeutFermer) {
                modal.remove();
            }
        };

        // Fermer avec Escape
        const fermerAvecEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', fermerAvecEscape);
            }
        };
        document.addEventListener('keydown', fermerAvecEscape);

        // Nettoyer l'event listener à la fermeture
        modal.addEventListener('remove', () => {
            document.removeEventListener('keydown', fermerAvecEscape);
        });

        document.body.appendChild(modal);
    }

    // Fonction pour créer une option avec checkbox
    function creerOptionCheckbox(titre, description, etatInitial, onchange) {
        const container = document.createElement('div');
        container.style.cssText = `
                display: flex;
                align-items: flex-start;
                padding: 15px;
                margin: 10px 0;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #6366f1;
            `;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = etatInitial; // Utiliser l'état initial passé en paramètre
        checkbox.style.cssText = `
                margin-right: 15px;
                margin-top: 2px;
                transform: scale(1.2);
                cursor: pointer;
            `;

        // Forcer la synchronisation avec l'état réel au moment de la création
        setTimeout(() => {
            checkbox.checked = etatInitial;
        }, 100);

        const contenuTexte = document.createElement('div');
        contenuTexte.style.cssText = 'flex: 1;';

        const titreLigne = document.createElement('div');
        titreLigne.textContent = titre;
        titreLigne.style.cssText = `
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
                cursor: pointer;
            `;

        const descriptionLigne = document.createElement('div');
        descriptionLigne.textContent = description;
        descriptionLigne.style.cssText = `
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            `;

        // Permettre de cliquer sur le titre pour toggle la checkbox
        titreLigne.onclick = () => {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        };

        checkbox.onchange = () => {
            onchange(checkbox.checked);
        };

        contenuTexte.appendChild(titreLigne);
        contenuTexte.appendChild(descriptionLigne);
        container.appendChild(checkbox);
        container.appendChild(contenuTexte);

        return container;
    }

    // Fonction pour créer la fenêtre de gestion des phrases
    function creerFenetreGestion() {
        // Supprimer la fenêtre existante si elle existe
        const existante = document.getElementById('fb-blocker-modal');
        if (existante) existante.remove();

        const modal = document.createElement('div');
        modal.id = 'fb-blocker-modal';
        modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 99999;
                display: flex;
                justify-content: center;
                align-items: center;
            `;

        const contenu = document.createElement('div');
        contenu.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 10px;
                max-width: 900px;
                width: 90%;
                max-height: 80%;
                overflow-y: auto;
                color: black;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            `;

        const titre = document.createElement('h3');
        titre.textContent = 'Gestion des phrases bloquées';
        titre.style.cssText = 'margin-top: 0; color: #333;';

        const phrasesDefaut = phrasesABloquer.slice(0, 11);
        const phrasesPersonnalisees = phrasesABloquer.slice(11);

        // Section phrases par défaut
        const sectionDefaut = document.createElement('div');
        sectionDefaut.innerHTML = '<h4 style="color: #666; margin-bottom: 10px;">📋 Phrases par défaut:</h4>';

        const containerDefaut = document.createElement('div');
        containerDefaut.style.cssText = `
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 8px;
                margin-bottom: 20px;
            `;

        phrasesDefaut.forEach(phrase => {
            const ligne = creerLignePhrase(phrase, false);
            containerDefaut.appendChild(ligne);
        });
        sectionDefaut.appendChild(containerDefaut);

        // Section phrases personnalisées
        const sectionPerso = document.createElement('div');
        sectionPerso.innerHTML = '<h4 style="color: #666; margin-bottom: 10px; margin-top: 20px;">✏️ Vos phrases:</h4>';

        if (phrasesPersonnalisees.length === 0) {
            const vide = document.createElement('p');
            vide.textContent = 'Aucune phrase personnalisée';
            vide.style.color = '#999';
            sectionPerso.appendChild(vide);
        } else {
            const containerPerso = document.createElement('div');
            containerPerso.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 8px;
                    margin-bottom: 20px;
                `;

            phrasesPersonnalisees.forEach(phrase => {
                const ligne = creerLignePhrase(phrase, true);
                containerPerso.appendChild(ligne);
            });
            sectionPerso.appendChild(containerPerso);
        }

        const boutonFermer = document.createElement('button');
        boutonFermer.textContent = 'Fermer';
        boutonFermer.style.cssText = `
                background: #666;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
            `;
        boutonFermer.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            modal.remove();
        };

        contenu.appendChild(titre);
        contenu.appendChild(sectionDefaut);
        contenu.appendChild(sectionPerso);
        contenu.appendChild(boutonFermer);
        modal.appendChild(contenu);

        // Empêcher la fermeture accidentelle
        contenu.onclick = (e) => {
            e.stopPropagation();
        };

        // Fermer en cliquant à l'extérieur (avec délai pour éviter la fermeture immédiate)
        let modalPeutFermer = false;
        setTimeout(() => {
            modalPeutFermer = true;
        }, 200);

        modal.onclick = (e) => {
            if (e.target === modal && modalPeutFermer) {
                modal.remove();
            }
        };

        // Fermer avec Escape
        const fermerAvecEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', fermerAvecEscape);
            }
        };
        document.addEventListener('keydown', fermerAvecEscape);

        document.body.appendChild(modal);
    }

    function creerLignePhrase(phrase, supprimable) {
        const ligne = document.createElement('div');
        ligne.style.cssText = `
                display: flex;
                flex-direction: column;
                padding: 10px;
                margin: 2px;
                background: #f5f5f5;
                border-radius: 5px;
                min-height: 80px;
                position: relative;
            `;

        const texte = document.createElement('div');
        texte.textContent = phrase;
        texte.style.cssText = `
                flex: 1; 
                font-size: 12px; 
                line-height: 1.3;
                word-break: break-word;
                margin-bottom: 8px;
            `;

        const boutonSuppr = document.createElement('button');
        boutonSuppr.innerHTML = supprimable ? '🗑️' : '🔒';
        boutonSuppr.title = supprimable ? 'Supprimer cette phrase' : 'Phrase par défaut (non supprimable)';
        boutonSuppr.style.cssText = `
                background: ${supprimable ? '#dc2626' : '#ccc'};
                color: white;
                border: none;
                padding: 4px 6px;
                border-radius: 3px;
                cursor: ${supprimable ? 'pointer' : 'not-allowed'};
                font-size: 10px;
                align-self: flex-end;
                width: fit-content;
            `;

        if (supprimable) {
            boutonSuppr.onclick = function () {
                if (confirm(`Supprimer la phrase: "${phrase}" ?`)) {
                    const index = phrasesABloquer.indexOf(phrase);
                    if (index > -1) {
                        phrasesABloquer.splice(index, 1);
                        sauvegarderPhrases();
                        ligne.remove();
                        alert(`Phrase supprimée: ${phrase}`);
                    }
                }
            };
        } else {
            boutonSuppr.disabled = true;
        }

        ligne.appendChild(texte);
        ligne.appendChild(boutonSuppr);
        return ligne;
    }

    // Démarrage
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initialiser();
            // Appliquer les options CSS après l'initialisation
            setTimeout(appliquerOptionsCSS, 500);
            // Masquer les Reels si l'option est activée
            if (options.masquerReels) {
                setTimeout(masquerReels, 600);
                setTimeout(masquerReels, 1500);
            }
            // Masquer les suggestions si l'option est activée
            if (options.masquerSuggestions) {
                setTimeout(masquerSuggestions, 700);
                setTimeout(masquerSuggestions, 1600);
            }
        });
    } else {
        initialiser();
        // Appliquer les options CSS immédiatement
        setTimeout(appliquerOptionsCSS, 500);
        // Masquer les Reels si l'option est activée
        if (options.masquerReels) {
            setTimeout(masquerReels, 600);
            setTimeout(masquerReels, 1500);
        }
        // Masquer les suggestions si l'option est activée
        if (options.masquerSuggestions) {
            setTimeout(masquerSuggestions, 700);
            setTimeout(masquerSuggestions, 1600);
        }
    }

    setTimeout(creerInterface, 2000);

    // Style CSS pour forcer le masquage même si Facebook réapplique ses styles
    const style = document.createElement('style');
    style.id = 'fcb-style-principal';
    let cssContent = `
            .script-blocked-post,
            [data-blocked-by-script="true"] {
                display: none !important;
                visibility: hidden !important;
                height: 0px !important;
                overflow: hidden !important;
                opacity: 0 !important;
                max-height: 0px !important;
            }
        `;

    // Ajouter immédiatement les styles pour les options activées
    if (options.masquerColonneDroite) {
        cssContent += `
                /* Masquer la colonne de droite immédiatement */
                div[role="complementary"] {
                    display: none !important;
                }
                div[role="main"] {
                    max-width: none !important;
                    width: calc(100% - 360px) !important;
                    margin-left: 360px !important;
                    margin-right: 0 !important;
                }
                div[role="feed"] {
                    max-width: none !important;
                    width: 100% !important;
                    padding-right: 20px !important;
                }
                div[role="feed"] > div {
                    max-width: none !important;
                    width: 100% !important;
                }
            `;
    }

    if (options.masquerReels) {
        cssContent += `
                /* Masquer les Reels immédiatement */
                [data-reels-hidden="true"] {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0px !important;
                    overflow: hidden !important;
                    opacity: 0 !important;
                    max-height: 0px !important;
                }
            `;
    }

    if (options.masquerSuggestions) {
        cssContent += `
                /* Masquer les suggestions immédiatement */
                [data-suggestions-hidden="true"] {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0px !important;
                    overflow: hidden !important;
                    opacity: 0 !important;
                    max-height: 0px !important;
                }
            `;
    }

    style.textContent = cssContent;
    document.head.appendChild(style);

    // LANCEMENT ULTRA-PRÉCOCE pour éviter le flash des contenus non filtrés
    function lancementPrecoce() {
        // Appliquer immédiatement les options CSS si elles sont activées
        if (options.masquerColonneDroite || options.masquerReels || options.masquerSuggestions) {
            appliquerOptionsCSS();
        }

        // Masquage CSS préventif pour les phrases communes
        const stylePreventif = document.createElement('style');
        stylePreventif.id = 'fcb-preventif';
        let cssPreventif = '';

        // Masquer préventivellement les éléments qui contiennent des phrases bloquées communes
        const phrasesCommunes = ['vous invite', 'invited you to join', 'rejoindre ce groupe', 'join this group'];
        phrasesCommunes.forEach(phrase => {
            cssPreventif += `
                    div:contains("${phrase}") {
                        opacity: 0 !important;
                        transition: opacity 0.1s;
                    }
                `;
        });

        // Masquage spécifique pour les suggestions
        if (options.masquerSuggestions) {
            cssPreventif += `
                    /* Masquage préventif des suggestions */
                    h3:contains("Personnes que vous pourriez connaître"),
                    h3:contains("People you may know") {
                        opacity: 0 !important;
                    }
                    /* Masquer les parents des h3 de suggestions */
                    h3:contains("Personnes que vous pourriez connaître") ~ *,
                    h3:contains("People you may know") ~ * {
                        opacity: 0 !important;
                    }
                `;
        }

        stylePreventif.textContent = cssPreventif;
        document.head.appendChild(stylePreventif);

        // Scanner immédiatement sans attendre
        setTimeout(scannerPosts, 0);
        setTimeout(scannerPosts, 50);
        setTimeout(scannerPosts, 150);

        // Masquer immédiatement les Reels et suggestions si activés
        if (options.masquerReels) {
            setTimeout(masquerReels, 0);
            setTimeout(masquerReels, 100);
        }

        if (options.masquerSuggestions) {
            setTimeout(masquerSuggestions, 0);
            setTimeout(masquerSuggestions, 100);
        }

        // Observer précoce pour intercepter les nouveaux contenus dès leur apparition
        if (document.body) {
            const observerPrecoce = new MutationObserver(function (mutations) {
                let nouveauxElements = false;
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                nouveauxElements = true;
                            }
                        });
                    }
                });

                if (nouveauxElements && scriptActif) {
                    // Réaction ultra-rapide
                    setTimeout(scannerPosts, 0);
                    setTimeout(masquerReels, 0);
                    setTimeout(masquerSuggestions, 0);
                }
            });

            observerPrecoce.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // Lancer immédiatement si possible, sinon dès que le DOM est prêt
    if (document.readyState !== 'loading') {
        // DOM déjà prêt
        lancementPrecoce();
    } else {
        // DOM en cours de chargement - lancer dès que possible
        document.addEventListener('DOMContentLoaded', lancementPrecoce);
    }

    // Lancement IMMÉDIAT même avant DOMContentLoaded pour un masquage ultra-rapide
    setTimeout(lancementPrecoce, 0);

})();