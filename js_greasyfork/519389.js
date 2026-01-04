// ==UserScript==
// @name         PromtEx
// @namespace    http://tampermonkey.net/
// @version      7.5
// @description  Un prompteur pour exposés
// @author       yglsan
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519389/PromtEx.user.js
// @updateURL https://update.greasyfork.org/scripts/519389/PromtEx.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrollSpeed = 1;
    let isPaused = true;
    let scrollInterval = null;
    let isMirrored = false;
		let accumulatedScroll = 0;


    // Créer le bouton flottant
    const button = document.createElement('button');
    button.innerText = 'PromtEx';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '15px';
    button.style.background = '#4A5568';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.fontSize = '18px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // Overlay du prompteur
    const teleprompterOverlay = document.createElement('div');
    teleprompterOverlay.style.position = 'fixed';
    teleprompterOverlay.style.top = '20px';
    teleprompterOverlay.style.left = '50%';
    teleprompterOverlay.style.transform = 'translateX(-50%)';
    teleprompterOverlay.style.width = '80%';
    teleprompterOverlay.style.height = '80%';
    teleprompterOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    teleprompterOverlay.style.color = 'white';
    teleprompterOverlay.style.display = 'none';
    teleprompterOverlay.style.zIndex = '999';
    teleprompterOverlay.style.padding = '20px';
    teleprompterOverlay.style.overflow = 'hidden';
    document.body.appendChild(teleprompterOverlay);

    // Bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '5px';
    teleprompterOverlay.appendChild(closeButton);

    closeButton.onclick = () => {
        teleprompterOverlay.style.display = 'none';
    };

    // Zone de texte
    const textArea = document.createElement('textarea');
    textArea.style.width = '100%';
    textArea.style.height = '90%';
    textArea.style.fontSize = '24px';
    textArea.style.lineHeight = '2.2';
    textArea.style.background = 'transparent';
    textArea.style.color = 'white';
    textArea.style.border = 'none';
    textArea.style.resize = 'none';
    textArea.style.outline = 'none';
    textArea.style.textAlign = 'center';
    textArea.style.paddingTop = '190px'; // Ajuster la hauteur du texte
    textArea.value = "\n\nExposé ici...\n";
    textArea.setAttribute('spellcheck', 'false');
    teleprompterOverlay.appendChild(textArea);

    // Barre orange
    const highlightBar = document.createElement('div');
    highlightBar.style.position = 'absolute';
    highlightBar.style.width = '100%';
    highlightBar.style.height = '30px';
    highlightBar.style.backgroundColor = 'rgba(255, 165, 0, 0.5)';
    highlightBar.style.top = '220px'; // Ajuster la position de la barre
    highlightBar.style.left = '0';
    highlightBar.style.zIndex = '1';
    highlightBar.style.pointerEvents = 'none';
    teleprompterOverlay.appendChild(highlightBar);

    // Fonction de défilement
   function startScrolling() {
        if (!isPaused) return;
        isPaused = false;
        scrollInterval = setInterval(() => {
            accumulatedScroll += scrollSpeed;
            if (accumulatedScroll >= 1) {
                const pixels = Math.floor(accumulatedScroll);
                textArea.scrollTop += pixels;
                accumulatedScroll -= pixels;
            }
        }, 50);
    }
   

    function stopScrolling() {
        isPaused = true;
        clearInterval(scrollInterval);
    }

    // Boutons de contrôle
    const controls = [
        { text: 'Démarrer', action: startScrolling },
        { text: 'Pause', action: stopScrolling },
        { text: 'Rembobiner', action: () => textArea.scrollTop = 0 },
        { text: 'Miroir', action: () => {
            isMirrored = !isMirrored;
            textArea.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
        }}
    ];

    controls.forEach(({ text, action }, index) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style.position = 'absolute';
        btn.style.bottom = '10px';
        btn.style.left = `${10 + index * 100}px`;
        btn.style.padding = '10px';
        btn.style.background = '#FFA500';
        btn.style.color = 'black';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = action;
        teleprompterOverlay.appendChild(btn);
    });

    // Barre de réglage de la vitesse
    const speedControl = document.createElement('input');
    speedControl.type = 'range';
    speedControl.min = '0.1';
    speedControl.max = '10';
    speedControl.step = '0.1';
    speedControl.value = scrollSpeed;
    speedControl.style.position = 'absolute';
    speedControl.style.bottom = '50px';
    speedControl.style.left = '50%';
    speedControl.style.transform = 'translateX(-50%)';
    teleprompterOverlay.appendChild(speedControl);

    speedControl.addEventListener('input', () => {
        scrollSpeed = parseFloat(speedControl.value); // Conversion en float
    });


    // Afficher le prompteur
    button.onclick = () => {
        teleprompterOverlay.style.display = 'block';
        textArea.scrollTop = 0;
    };

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            teleprompterOverlay.style.display = 'none';
        }
    });
})();