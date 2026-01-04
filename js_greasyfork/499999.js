// ==UserScript==
// @name         Chat Youtube - Alerte Sonore et Lecteur d'Écran avec Réglages
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Ajoute une alerte sonore et informe les lecteurs d'écran lorsqu'un nouveau message est publié sur le chat de YouTube, avec des options pour désactiver les notifications sonores, la lecture automatique des messages par le lecteur d'écran, et ajuster le volume des notifications sonores. Ce script est dédié aux non-voyants, utilisant des cases à cocher pour désactiver les notifications et la lecture automatique, ainsi qu'un menu déroulant pour ajuster le volume sonore.
// @author       games-access.net
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @homepageURL  https://greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/499999/Chat%20Youtube%20-%20Alerte%20Sonore%20et%20Lecteur%20d%27%C3%89cran%20avec%20R%C3%A9glages.user.js
// @updateURL https://update.greasyfork.org/scripts/499999/Chat%20Youtube%20-%20Alerte%20Sonore%20et%20Lecteur%20d%27%C3%89cran%20avec%20R%C3%A9glages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const alertSoundUrl = 'https://freesound.org/data/previews/235/235911_2391840-lq.mp3';
    const alertSound = new Audio(alertSoundUrl);
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.margin = '-1px';
    liveRegion.style.border = '0';
    liveRegion.style.padding = '0';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);

    let disableSound = false;
    let disableScreenReader = false;

    function playAlertSound() {
        if (!disableSound) {
            alertSound.play();
        }
    }

    function updateLiveRegion(message) {
        if (!disableScreenReader) {
            liveRegion.textContent = message;
        }
    }

    const chatObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const usernameElement = node.querySelector('#author-name');
                    const messageElement = node.querySelector('#message');
                    if (usernameElement && messageElement) {
                        const username = usernameElement.textContent.trim();
                        const message = messageElement.textContent.trim();
                        if (username && message) {
                            playAlertSound();
                            updateLiveRegion(`${username} dit ${message}`);
                        }
                    }
                }
            });
        });
    });

    function observeChatContainer() {
        const chatContainer = document.querySelector('#item-scroller');
        if (chatContainer) {
            chatObserver.observe(chatContainer, { childList: true, subtree: true });
        } else {
            setTimeout(observeChatContainer, 1000);
        }
    }

    observeChatContainer();

    function createOptionsUI() {
        const optionsContainer = document.createElement('div');
        optionsContainer.style.position = 'fixed';
        optionsContainer.style.top = '10px';
        optionsContainer.style.right = '10px';
        optionsContainer.style.zIndex = '9999';
        optionsContainer.style.background = '#fff';
        optionsContainer.style.padding = '10px';
        optionsContainer.style.border = '1px solid #ccc';
        optionsContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        optionsContainer.style.fontFamily = 'Arial, sans-serif';
        optionsContainer.style.fontSize = '14px';

        const disableSoundCheckbox = document.createElement('input');
        disableSoundCheckbox.type = 'checkbox';
        disableSoundCheckbox.id = 'disableSoundCheckbox';
        disableSoundCheckbox.checked = disableSound;
        const disableSoundLabel = document.createElement('label');
        disableSoundLabel.setAttribute('for', 'disableSoundCheckbox');
        disableSoundLabel.textContent = 'Désactiver les notifications sonores';
        disableSoundLabel.style.marginRight = '10px';
        optionsContainer.appendChild(disableSoundCheckbox);
        optionsContainer.appendChild(disableSoundLabel);

        disableSoundCheckbox.addEventListener('change', function() {
            disableSound = this.checked;
        });

        const disableScreenReaderCheckbox = document.createElement('input');
        disableScreenReaderCheckbox.type = 'checkbox';
        disableScreenReaderCheckbox.id = 'disableScreenReaderCheckbox';
        disableScreenReaderCheckbox.checked = disableScreenReader;
        const disableScreenReaderLabel = document.createElement('label');
        disableScreenReaderLabel.setAttribute('for', 'disableScreenReaderCheckbox');
        disableScreenReaderLabel.textContent = 'Désactiver la lecture automatique par le lecteur d\'écran';
        optionsContainer.appendChild(document.createElement('br'));
        optionsContainer.appendChild(disableScreenReaderCheckbox);
        optionsContainer.appendChild(disableScreenReaderLabel);

        disableScreenReaderCheckbox.addEventListener('change', function() {
            disableScreenReader = this.checked;
            if (disableScreenReader) {
                liveRegion.textContent = '';
            }
        });

        const volumeSelect = document.createElement('select');
        volumeSelect.id = 'volumeSelect';
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i * 10}%`;
            volumeSelect.appendChild(option);
        }
        volumeSelect.value = 10;
        const volumeLabel = document.createElement('label');
        volumeLabel.setAttribute('for', 'volumeSelect');
        volumeLabel.textContent = 'Volume des notifications sonores:';
        optionsContainer.appendChild(document.createElement('br'));
        optionsContainer.appendChild(volumeLabel);
        optionsContainer.appendChild(volumeSelect);

        volumeSelect.addEventListener('change', function() {
            alertSound.volume = this.value / 10;
        });

        document.body.appendChild(optionsContainer);
    }

    createOptionsUI();
})();
