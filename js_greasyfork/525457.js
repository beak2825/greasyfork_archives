// ==UserScript==
// @name         DL videos Youtube
// @namespace    https://greasyfork.org/
// @version      1.13
// @description  Ajoute un bouton pour télécharger des vidéos via Y2Mate sur YouTube et via SaveTheVideo sur Twitter avec une option pour les masquer via la touche "H"
// @author       Lakfu Sama
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525457/DL%20videos%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/525457/DL%20videos%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isButtonVisible = true;

    function addDownloadButtons() {
        const videos = document.querySelectorAll('video');
        if (videos.length === 0) return;

        videos.forEach(video => {
            if (video.dataset.hasDownloadButtons) return;
            video.dataset.hasDownloadButtons = true;

            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.zIndex = '1000';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '5px';

            // Ajouter le bouton pour Y2Mate uniquement sur YouTube
            if (window.location.hostname.includes('youtube.com')) {
                const y2mateButton = document.createElement('button');
                y2mateButton.innerText = 'Télécharger via Y2Mate';
                y2mateButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                y2mateButton.style.color = 'white';
                y2mateButton.style.border = 'none';
                y2mateButton.style.padding = '8px 12px';
                y2mateButton.style.fontSize = '12px';
                y2mateButton.style.cursor = 'pointer';
                y2mateButton.style.borderRadius = '5px';
                y2mateButton.style.opacity = '0.8';
                y2mateButton.onmouseenter = () => { y2mateButton.style.opacity = '1'; };
                y2mateButton.onmouseleave = () => { y2mateButton.style.opacity = '0.8'; };
                y2mateButton.onclick = () => openY2Mate(video);
                container.appendChild(y2mateButton);
            }

            // Ajouter le bouton pour SaveTheVideo uniquement sur Twitter (X)
            if (window.location.hostname.includes('x.com')) {
                const saveTheVideoButton = document.createElement('button');
                saveTheVideoButton.innerText = 'Télécharger via SaveTheVideo';
                saveTheVideoButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                saveTheVideoButton.style.color = 'white';
                saveTheVideoButton.style.border = 'none';
                saveTheVideoButton.style.padding = '8px 12px';
                saveTheVideoButton.style.fontSize = '12px';
                saveTheVideoButton.style.cursor = 'pointer';
                saveTheVideoButton.style.borderRadius = '5px';
                saveTheVideoButton.style.opacity = '0.8';
                saveTheVideoButton.onmouseenter = () => { saveTheVideoButton.style.opacity = '1'; };
                saveTheVideoButton.onmouseleave = () => { saveTheVideoButton.style.opacity = '0.8'; };
                saveTheVideoButton.onclick = () => window.open('https://www.savethevideo.com/fr/downloader', '_blank');
                container.appendChild(saveTheVideoButton);
            }

            video.parentNode.style.position = 'relative';
            video.parentNode.appendChild(container);
        });
    }

    function openY2Mate(video) {
        let videoUrl = video.querySelector('source')?.src || video.src;
        if (!videoUrl) {
            alert('Impossible de détecter la vidéo');
            return;
        }

        if (window.location.hostname.includes('youtube.com')) {
            const videoId = new URLSearchParams(window.location.search).get('v');
            if (videoId) {
                window.open(`https://www.y2mate.com/fr/youtube/${videoId}`, '_blank');
                return;
            }
        }

        alert("Ce site ne permet pas la récupération directe via Y2Mate.");
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(addDownloadButtons);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Gestion du raccourci "h" pour masquer/afficher les boutons
    function toggleButtonsVisibility() {
        isButtonVisible = !isButtonVisible;
        document.querySelectorAll('button').forEach(button => {
            if (button.innerText.includes('Télécharger via Y2Mate') || button.innerText.includes('Télécharger via SaveTheVideo')) {
                button.style.display = isButtonVisible ? 'block' : 'none';
            }
        });
    }

    // Écouteur de l'événement "keydown" pour masquer/afficher les boutons via la touche "h"
    document.addEventListener('keydown', (event) => {
        if (event.key === 'h') { // Appuyer sur 'h' pour masquer/afficher les boutons
            toggleButtonsVisibility();
        }
    });

    window.addEventListener('load', () => {
        addDownloadButtons();
        observeDOMChanges();
    });
})();
