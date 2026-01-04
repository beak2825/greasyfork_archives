// ==UserScript==
// @name         YouTube BINGO Timecode + Force 1080p
// @namespace    https://nadines.hy.per
// @author       Vave
// @version      1.1
// @license      MIT
// @description  Affichage du timecode de la vidéo avec position draggable mémorisée et forçage de la qualité à 1080p
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509163/YouTube%20BINGO%20Timecode%20%2B%20Force%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/509163/YouTube%20BINGO%20Timecode%20%2B%20Force%201080p.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const POSITION_KEY = 'youtube_time_display_position'; // Clé pour mémoriser la position dans le localStorage
    const CHANNEL_NAME = 'Génération Sitcoms'; // Nom de la chaîne ciblée
    const QUALITY = 'hd1080'; // Qualité désirée
    let isQualitySet = false; // Variable de contrôle pour s'assurer que la qualité est forcée une seule fois

    // Fonction pour récupérer la position sauvegardée depuis le localStorage
    function getSavedPosition() {
        const savedPosition = localStorage.getItem(POSITION_KEY);
        return savedPosition ? JSON.parse(savedPosition) : { top: '560px', left: '540px' }; // Position par défaut
    }

    // Fonction pour sauvegarder la position dans le localStorage
    function savePosition(top, left) {
        const position = { top, left };
        localStorage.setItem(POSITION_KEY, JSON.stringify(position));
    }

    // Fonction pour récupérer le nom de la chaîne
    function getChannelName() {
        //let elem = document.getElementById('text');
        const elem = document.querySelector('#container #text-container #text a');
        return elem ? elem.textContent : '';
    }

    // Fonction pour forcer la qualité vidéo à 1080p
    function forceVideoQuality() {
        if (isQualitySet) return; // Ne pas forcer la qualité à nouveau si déjà fait

        const player = document.querySelector('.html5-video-player');
        if (!player) return;

        player.querySelector('.ytp-settings-button').click(); // Ouvre le menu paramètres
        setTimeout(() => {
            const qualityMenuItem = Array.from(document.querySelectorAll('.ytp-menuitem')).find(el => el.textContent.includes('Qualité'));
            if (qualityMenuItem) {
                qualityMenuItem.click(); // Ouvre le sous-menu Qualité
                setTimeout(() => {
                    const qualityOption = Array.from(document.querySelectorAll('.ytp-menuitem')).find(el => el.textContent.includes('1080p'));
                    if (qualityOption) {
                        qualityOption.click(); // Sélectionne 1080p
                        console.log('Qualité forcée à 1080p');
                        isQualitySet = true; // Marque que la qualité a été forcée

                        // Fermer le menu paramètres après la sélection de la qualité
                        setTimeout(() => {
                            player.querySelector('.ytp-settings-button').click(); // Ferme le menu
                        }, 500);
                    } else {
                        console.log('1080p non disponible');
                        setTimeout(() => {
                            player.querySelector('.ytp-settings-button').click(); // Ferme le menu si 1080p non disponible
                        }, 500);
                    }
                }, 500);
            }
        }, 500);
    }

    // Création de la div pour afficher le timecode
    const timeDisplay = document.createElement('div');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function setupTimeDisplay() {
        const savedPosition = getSavedPosition(); // Récupérer la position sauvegardée

        // Appliquer la position sauvegardée à la div
        timeDisplay.style.position = 'fixed';
        timeDisplay.style.top = savedPosition.top;
        timeDisplay.style.left = savedPosition.left;
        timeDisplay.style.padding = '10px';
        timeDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        timeDisplay.style.color = 'white';
        timeDisplay.style.fontSize = '16px';
        timeDisplay.style.borderRadius = '8px';
        timeDisplay.style.zIndex = '9999';
        timeDisplay.style.cursor = 'move'; // Changer le curseur pour indiquer que la div est déplaçable
        document.body.appendChild(timeDisplay);

        // Rendre la div draggable
        timeDisplay.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - timeDisplay.offsetLeft;
            offsetY = e.clientY - timeDisplay.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const newLeft = e.clientX - offsetX + 'px';
                const newTop = e.clientY - offsetY + 'px';
                timeDisplay.style.left = newLeft;
                timeDisplay.style.top = newTop;
            }
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                // Sauvegarder la position actuelle de la div dans le localStorage
                savePosition(timeDisplay.style.top, timeDisplay.style.left);
            }
        });

        // Ajouter un événement pour le double-clic sur timeDisplay
        timeDisplay.addEventListener('dblclick', function() {
            console.log("Double click OK");
            showBingoText(); // Appeler la fonction pour afficher le texte "BINGO"
        });
    }

    // Fonction pour afficher et animer le texte "BINGO"
    function showBingoText() {
        // Créer une div pour le texte "BINGO"
        const bingoText = document.createElement('div');
        bingoText.textContent = "BINGO";
        bingoText.style.position = 'fixed';
        bingoText.style.top = '50%';
        bingoText.style.left = '50%';
        bingoText.style.transform = 'translate(-50%, -50%)';
        bingoText.style.fontSize = '10px'; // Taille de départ
        bingoText.style.color = 'red';
        bingoText.style.opacity = '1'; // Départ visible
        bingoText.style.zIndex = '10000';
        document.body.appendChild(bingoText);

        // Animer le texte "BINGO" en utilisant CSS et JavaScript
        let size = 10; // Taille initiale de la police
        let opacity = 1; // Opacité initiale
        const duration = 5000; // Durée de l'animation (en ms)
        const interval = 50; // Intervalle de mise à jour (en ms)
        const steps = duration / interval; // Nombre d'étapes de l'animation
        let currentStep = 0; // Étape actuelle

        const animation = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(animation); // Arrêter l'animation
                document.body.removeChild(bingoText); // Supprimer la div après l'animation
                return;
            }
            currentStep++;
            size += 0.5; // Augmenter la taille de la police
            opacity -= 1 / steps; // Diminuer l'opacité progressivement

            // Appliquer les styles à la div
            bingoText.style.fontSize = `${size}px`;
            bingoText.style.opacity = `${opacity}`;
        }, interval);
    }

    // Mise à jour du timecode affiché
    function updateTime() {
        const videoElement = document.querySelector('video');

        if (videoElement && !videoElement.paused) {
            const currentTime = videoElement.currentTime;
            const hours = Math.floor(currentTime / 3600);
            const minutes = Math.floor((currentTime % 3600) / 60);
            const seconds = Math.floor(currentTime % 60);

            const formattedTime = `${hours > 0 ? `${hours}:` : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeDisplay.textContent = formattedTime;
        }
    }

    // Vérifier la vidéo et mettre à jour le timecode
    function checkVideoAndUpdate() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('timeupdate', updateTime);
            if (!isQualitySet) {
                forceVideoQuality(); // Forcer la qualité vidéo à 1080p
            }
        }
    }

    // Fonction pour détecter les changements d'URL (navigation dynamique)
    let lastUrl = window.location.href;
    const detectUrlChange = () => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('URL changed:', currentUrl);
            isQualitySet = false; // Réinitialiser la qualité pour la nouvelle vidéo
            checkVideoAndUpdate(); // Vérifier la nouvelle vidéo
        }
    };

    // Exécution toutes les 1 seconde pour détecter les changements d'URL
    setInterval(detectUrlChange, 1000);

    // Observer les changements dans le DOM et ajouter la div lorsque nécessaire
    const observer = new MutationObserver(mutations => {
        if (window.location.href.startsWith('https://www.youtube.com/watch')) {
            const channelName = getChannelName();
            //console.log('Channel Name:', channelName);

            //if (channelName.toLowerCase() === CHANNEL_NAME.toLowerCase()) {
            if (channelName === CHANNEL_NAME) {
                // Afficher la div seulement si le nom de la chaîne est celui attendu
                if (!document.body.contains(timeDisplay)) {
                    setupTimeDisplay();
                }
                checkVideoAndUpdate();
            } else {
                // Retirer la div si le nom de la chaîne est différent
                if (document.body.contains(timeDisplay)) {
                    document.body.removeChild(timeDisplay);
                }
            }
        } else {
            // Retirer la div si ce n'est pas une page de vidéo
            if (document.body.contains(timeDisplay)) {
                document.body.removeChild(timeDisplay);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
