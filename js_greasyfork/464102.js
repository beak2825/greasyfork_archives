// ==UserScript==
// @name        Moyenne SensCritique
// @description Moyenne des épisodes des séries TV de SensCritique
// @match       *://www.senscritique.com/*
// @icon        https://senscritique.com/app-icons/favicon-32x32.png
// @version     3.0
// @namespace   https://greasyfork.org/users/1060999
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/478566/Moyenne%20SensCritique.user.js
// @updateURL https://update.greasyfork.org/scripts/478566/Moyenne%20SensCritique.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // État de l'application
    const state = {
        buttonsCreated: false,
        isLastEpisode: false,
        currentSeasonText: '',
        clickCount: 0
    };

    // Sélecteurs constants
    const SELECTORS = {
        seasonTitle: 'span[data-testid="season-rating-title"]',
        linkText: 'span[data-testid="link-text"]',
        section: '[data-testid="section"]',
        clickButton: '[data-testid="click-1"]',
        productActions: '[data-testid="product-actions-hover"]',
        productCard: '[data-testid="product-card"]'
    };

    // Styles constants
    const BUTTON_STYLES = {
        default: {
            background: 'rgba(67, 72, 80, 0.25)',
            color: 'rgba(255, 255, 255, 0.85)'
        },
        hover: {
            background: 'rgba(67, 72, 80, 0.65)'
        },
        active: {
            background: 'rgba(67, 72, 80, 1)',
            color: 'rgba(255, 255, 255, 1)',
            borderTopColor: '#8a8a8a',
            boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.2)'
        }
    };

    // Utilitaire pour appliquer des styles multiples
    function applyStyles(element, styles) {
        Object.entries(styles).forEach(([key, value]) => {
            element.style[key] = value;
        });
    }

    // Créer le bouton de calcul de moyenne
    function createAverageButton() {
        const linkElement = document.querySelector(SELECTORS.linkText);
        if (!linkElement) return null;

        const span = document.createElement('span');
        span.className = linkElement.className;
        span.innerHTML = 'Calculer la moyenne';
        span.style.marginRight = '20px';

        return span;
    }

    // Créer le bouton "Dernier épisode"
    function createLastEpisodeButton() {
        const clickButton = document.querySelector(SELECTORS.clickButton);
        if (!clickButton) return null;

        const button = document.createElement('button');
        button.innerText = 'Dernier épisode';
        button.className = clickButton.className;

        applyStyles(button, {
            height: '20px',
            width: '165px',
            marginLeft: '3px',
            transition: 'background-color 0.35s',
            ...BUTTON_STYLES.default
        });

        setupLastEpisodeButtonEvents(button);
        return button;
    }

    // Gérer les événements du bouton "Dernier épisode"
    function setupLastEpisodeButtonEvents(button) {
        button.addEventListener('click', () => {
            state.isLastEpisode = !state.isLastEpisode;

            if (state.isLastEpisode) {
                applyStyles(button, BUTTON_STYLES.active);
            } else {
                applyStyles(button, BUTTON_STYLES.default);
            }
        });

        button.addEventListener('mouseenter', () => {
            if (!state.isLastEpisode) {
                button.style.background = BUTTON_STYLES.hover.background;
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!state.isLastEpisode) {
                button.style.background = BUTTON_STYLES.default.background;
            }
        });
    }

    // Calculer la moyenne des épisodes
    function calculateAverage() {
        const ratingsElements = Array.from(
            document.querySelectorAll(SELECTORS.productActions)
        ).filter(el => !el.closest(SELECTORS.productCard));

        const seasonTitle = document.querySelector(SELECTORS.seasonTitle);
        const isSeason1 = /^\s*Saison\s+1\b/i.test(seasonTitle?.textContent || '');

        let sum = 0;
        let count = 0;

        ratingsElements.forEach((element, index) => {
            const rating = parseFloat(element.textContent);
            if (isNaN(rating)) return;

            const isFirst = index === 0;
            const isLast = index === ratingsElements.length - 1;

            // Appliquer les coefficients
            if ((isFirst && !isSeason1) || (isLast && !state.isLastEpisode)) {
                sum += rating * 2;
                count += 2;
            } else if ((isFirst && isSeason1) || (isLast && state.isLastEpisode)) {
                sum += rating * 3;
                count += 3;
            } else {
                sum += rating;
                count++;
            }
        });

        return count > 0 ? sum / count : 0;
    }

    // Afficher la moyenne
    function displayAverage(average) {
        let averageDisplay = document.querySelector('.average-display');
        let divDisplay = document.querySelector('.div-display');

        // Toujours créer les éléments s'ils n'existent pas
        if (!averageDisplay) {
            const episodesSection = document.querySelectorAll(SELECTORS.section)[7];
            if (!episodesSection) return;

            averageDisplay = document.createElement('span');
            averageDisplay.classList.add('average-display');

            divDisplay = document.createElement('div');
            divDisplay.classList.add('div-display');
            divDisplay.innerHTML = 'Moyenne';

            episodesSection.appendChild(document.createTextNode(' '));
            episodesSection.appendChild(divDisplay);
            episodesSection.appendChild(document.createTextNode(' '));
            episodesSection.appendChild(averageDisplay);

            applyStyles(divDisplay, {
                height: '35px',
                fontSize: '15px',
                fontWeight: 'normal',
                float: 'left',
                fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif"
            });
        }

        averageDisplay.innerHTML = `La moyenne des notes est égale à ${average.toFixed(2)}`;

        applyStyles(averageDisplay, {
            fontSize: '15px',
            float: 'right',
            fontWeight: 'normal',
            fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif"
        });
    }

    // Initialiser les boutons
    function initializeButtons() {
        if (state.buttonsCreated) return;

        const seasonSpan = document.querySelector(SELECTORS.seasonTitle);
        if (!seasonSpan) return;

        // Nettoyer les boutons existants avant d'en créer de nouveaux
        cleanupButtons();

        // Créer le bouton de moyenne
        const averageButton = createAverageButton();
        if (!averageButton) return;

        const linkText = document.querySelector(SELECTORS.linkText);
        linkText.parentNode.insertBefore(averageButton, linkText);

        // Gérer le clic sur le bouton de moyenne
        averageButton.addEventListener('click', () => {
            state.clickCount++;
            const average = calculateAverage();
            displayAverage(average);
        });

        // Créer le bouton "Dernier épisode"
        const lastButton = createLastEpisodeButton();
        if (!lastButton) return;

        const episodesSection = document.querySelectorAll(SELECTORS.section)[9];
        if (episodesSection) {
            episodesSection.style.marginBottom = '10px';
        }

        const specificElement = document.querySelectorAll(SELECTORS.section)[10];
        if (specificElement) {
            specificElement.parentNode.insertBefore(lastButton, specificElement);
        }

        state.buttonsCreated = true;
    }

    // Réinitialiser l'affichage
    function resetDisplay() {
        const averageDisplay = document.querySelector('.average-display');
        const divDisplay = document.querySelector('.div-display');

        if (averageDisplay) averageDisplay.innerHTML = '';
        if (divDisplay) divDisplay.innerHTML = '';

        state.clickCount = 0;
    }

    // Nettoyer les boutons existants
    function cleanupButtons() {
        // Supprimer le bouton "Calculer la moyenne"
        const linkText = document.querySelector(SELECTORS.linkText);
        if (linkText && linkText.previousElementSibling) {
            const prevSpan = linkText.previousElementSibling;
            if (prevSpan.innerHTML === 'Calculer la moyenne') {
                prevSpan.remove();
            }
        }

        // Supprimer le bouton "Dernier épisode"
        const clickButton = document.querySelector(SELECTORS.clickButton);
        if (clickButton) {
            const lastButtons = document.querySelectorAll(`button.${clickButton.className.split(' ').join('.')}`);
            lastButtons.forEach(btn => {
                if (btn.innerText === 'Dernier épisode') {
                    btn.remove();
                }
            });
        }

        // Supprimer complètement les éléments d'affichage
        const averageDisplay = document.querySelector('.average-display');
        const divDisplay = document.querySelector('.div-display');

        if (averageDisplay) averageDisplay.remove();
        if (divDisplay) divDisplay.remove();

        state.clickCount = 0;
    }

    // Surveiller les changements de saison
    function monitorSeasonChange() {
        const seasonSpan = document.querySelector(SELECTORS.seasonTitle);
        if (!seasonSpan) return;

        state.currentSeasonText = seasonSpan.textContent;

        setInterval(() => {
            const currentSpan = document.querySelector(SELECTORS.seasonTitle);
            if (!currentSpan) return;

            const newText = currentSpan.textContent;
            if (newText !== state.currentSeasonText) {
                state.isLastEpisode = false;

                // Nettoyer avant de réinitialiser
                cleanupButtons();

                state.currentSeasonText = newText;
                state.buttonsCreated = false;
                initializeButtons();
            }
        }, 222);
    }

    // Observer les changements de page
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            const htmlElement = document.documentElement;
            if (htmlElement.classList.contains('nprogress-busy')) {
                setTimeout(() => {
                    cleanupButtons();
                    state.buttonsCreated = false;
                    initializeButtons();
                    monitorSeasonChange();
                }, 1000);
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Point d'entrée principal
    function init() {
        if (window.self !== window.top) return;

        // Attendre que l'élément clé soit disponible
        const checkElement = setInterval(() => {
            if (document.querySelector(SELECTORS.seasonTitle)) {
                clearInterval(checkElement);
                initializeButtons();
                monitorSeasonChange();
                observePageChanges();
            }
        }, 300);
    }

    // Démarrer l'application
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();