// ==UserScript==
// @name         AntiADS Hobba.tv
// @version      2.1
// @description  Bloqueador de anuncios para Hobba.tv || Hecho por @swxx || Contacto: https://insane.rip/6
// @author       https://insane.rip/6
// @match        *://*.hobba.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/1357623
// @downloadURL https://update.greasyfork.org/scripts/505141/AntiADS%20Hobbatv.user.js
// @updateURL https://update.greasyfork.org/scripts/505141/AntiADS%20Hobbatv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ALERT_ID = 'antiads-alert'; // Identificador único para la alerta
    const FADE_OUT_DURATION = 1000; // Duración del desvanecimiento en milisegundos

    function createAlert() {
        // Verifica si la alerta ya existe
        const existingAlert = document.getElementById(ALERT_ID);
        if (!existingAlert) {
            // Crea una nueva alerta
            const alertContainer = document.createElement('div');
            alertContainer.id = ALERT_ID; // Asigna el id único
            alertContainer.className = 'd-flex gap-2 nitro-notification-bubble notification-lateral notification-height rounded p-2';
            alertContainer.style.opacity = '1';
            alertContainer.style.transition = `opacity ${FADE_OUT_DURATION}ms ease-out`; // Agrega transición

            const bubbleImageContainer = document.createElement('div');
            bubbleImageContainer.className = 'd-flex bubble-image-container';
            const bubbleImage = document.createElement('div');
            bubbleImage.className = 'icon bubble-image';
            bubbleImage.style.backgroundImage = 'url("https://imgur.com/l0SQHBl.png")'; // Imagen de la alerta
            bubbleImage.style.width = '50px';
            bubbleImage.style.height = '50px';
            bubbleImage.style.backgroundSize = 'cover';
            bubbleImageContainer.appendChild(bubbleImage);

            const notificationText = document.createElement('div');
            notificationText.className = 'd-flex notification-bubble-text';
            notificationText.textContent = 'Bloqueador de anuncios activado. En caso de problema contactar con @swxx';

            alertContainer.appendChild(bubbleImageContainer);
            alertContainer.appendChild(notificationText);

            const rightSide = document.querySelector('.nitro-right-side');
            if (rightSide) {
                rightSide.appendChild(alertContainer);
            }
        }
    }

    function removeAlert() {
        const alertToRemove = document.getElementById(ALERT_ID);
        if (alertToRemove) {
            alertToRemove.style.opacity = '0'; // Inicia el efecto de desvanecimiento

            // Espera la duración del desvanecimiento antes de eliminar el elemento
            setTimeout(() => {
                alertToRemove.remove();
            }, FADE_OUT_DURATION);
        }
    }

    function checkAndCreateAlert() {
        // Verifica la existencia de la alerta y crea una nueva si no está presente
        createAlert();
    }

    function removeAds() {
        const adBoxElements = document.querySelectorAll('#ad-box');
        adBoxElements.forEach(function(el) {
            const hasAdClass = [...el.classList].some(cls => cls.startsWith('ad1') || cls.startsWith('ad2') || cls.startsWith('ad3'));
            if (hasAdClass) {
                el.remove();
            }
        });
    }

    function addEventToList() {
        const eventsList = document.querySelector('#events-list');
        if (eventsList) {
            const newEvent = document.createElement('li');
            const timestamp = Date.now() + 24 * 60 * 60 * 1000;
            newEvent.setAttribute('timestamp', timestamp.toString());

            const countdownSpan = document.createElement('span');
            countdownSpan.className = 'event-countdown';
            countdownSpan.textContent = '99h 99 min';

            const titleSpan = document.createElement('span');
            titleSpan.className = 'event-title';
            titleSpan.textContent = 'AntiADS by @swxx';
            titleSpan.style.color = '#ea73e1';

            newEvent.appendChild(countdownSpan);
            newEvent.appendChild(titleSpan);

            eventsList.insertBefore(newEvent, eventsList.firstChild);
        }
    }

    function observeNitropediaContent() {
        const observer = new MutationObserver(function(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const nitropediaContent = document.querySelector('.nitropedia-content');
                    if (nitropediaContent) {
                        const existingH3 = nitropediaContent.querySelector('h3');
                        if (!existingH3 || !existingH3.textContent.includes('Antiads by @swxx')) {
                            const newH3 = document.createElement('h3');

                            const link = document.createElement('a');
                            link.href = 'https://insane.rip/6';
                            link.textContent = 'Antiads by @swxx';
                            link.style.color = 'inherit';
                            link.style.textDecoration = 'none';
                            link.style.marginRight = '10px';

                            const img = document.createElement('img');
                            img.src = 'https://cdn.7tv.app/emote/60cb3235c66afba9ff196d77/1x.gif';
                            img.alt = 'Antiads Image';
                            img.style.height = '40px';
                            img.style.verticalAlign = 'middle';
                            img.style.marginLeft = '5px';

                            newH3.appendChild(link);
                            newH3.appendChild(img);

                            if (existingH3) {
                                nitropediaContent.insertBefore(newH3, existingH3);
                            } else {
                                nitropediaContent.appendChild(newH3);
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Ejecuta las funciones al cargar
    setTimeout(function() {
        removeAds();
        addEventToList();
        observeNitropediaContent();
        checkAndCreateAlert(); // Crear la alerta inicial
    }, 30000);

    // Ejecuta la comprobación y creación cada 20 segundos
    setInterval(checkAndCreateAlert, 60000);

    // Ejecuta la eliminación de la alerta creada por el script cada 15 segundos
    setInterval(removeAlert, 20000);
})();
