// ==UserScript==
// @name         Fullscreen WhatsApp Web + Hide Chat List + Blur Sent Photos
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license      nothing, just tag me
// @description  Nascondi la lista delle chat su WhatsApp Web quando il mouse non è sopra di essa, fai occupare all'interfaccia l'intero schermo, e sfoca le foto inviate nei messaggi, che si schiariscono al passaggio del mouse.
// @author       EmaBixD
// @match        https://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504137/Fullscreen%20WhatsApp%20Web%20%2B%20Hide%20Chat%20List%20%2B%20Blur%20Sent%20Photos.user.js
// @updateURL https://update.greasyfork.org/scripts/504137/Fullscreen%20WhatsApp%20Web%20%2B%20Hide%20Chat%20List%20%2B%20Blur%20Sent%20Photos.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let chatList;

    // Funzione per ottenere il tema corrente
    function getTheme() {
        const body = document.body;
        return body.classList.contains('dark') ? 'dark' : 'light';
    }

    // Funzione per applicare il colore di sfondo in base al tema
    function applyTheme() {
        if (chatList) {
            const theme = getTheme();
            chatList.style.backgroundColor = theme === 'dark' ? '#111b21' : '#ffffff';
        }
    }

    // Applicare lo stile per l'interfaccia a schermo intero e la sfocatura delle immagini
    var st = document.createElement("STYLE");
    st.innerHTML = `
        .app-wrapper-web .two, .app-wrapper-web .three {
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
        }

        /* Stile per la sfocatura delle immagini inviate nei messaggi */
        .blurred-image {
            filter: blur(8px);
            transition: filter 0.3s ease;
        }

        .blurred-image:hover {
            filter: none;
        }
    `;
    document.body.appendChild(st);

    let hasInitialized = false;
    const hideThreshold = 40;

    // Aggiorna la visibilità della lista delle chat
    function updateChatListVisibility(event) {
        chatList = document.querySelector('div._aigs > div:nth-child(4)');

        if (chatList) {
            const headerElement = chatList.querySelector('header');
            const sideElement = chatList.querySelector('#side');

            if (!hasInitialized) {
                chatList.style.display = 'flex';
                chatList.style.flex = 'unset';
                chatList.style.maxWidth = '300px';
                chatList.style.width = '0%';

                applyTheme();  // Applica il colore di sfondo in base al tema

                chatList.style.transition = 'width .5s ease-out 0s';

                sideElement.style.opacity = '0';
                sideElement.style.transition = 'opacity .5s ease-out 0s';

                headerElement.style.opacity = '0';
                headerElement.style.transition = 'all .5s ease-out 0s';

                hasInitialized = true;
            }

            const isMouseOverElement = chatList.contains(event.target);

            if (isMouseOverElement || event.clientX <= hideThreshold) {
                // Mostra
                chatList.style.width = '100%';
                sideElement.style.opacity = '1';
                headerElement.style.opacity = '1';
            } else {
                // Nascondi
                chatList.style.width = '0%';
                sideElement.style.opacity = '0';
                headerElement.style.opacity = '0';
            }
        }
    }

    // Aggiunge la classe di sfocatura alle immagini inviate nei messaggi
    function blurSentPhotos() {
        const sentPhotos = document.querySelectorAll('img.x15kfjtz.x1c4vz4f.x2lah0s.xdl72j9.x127lhb5.x4afe7t.xa3vuyk.x10e4vud');
        sentPhotos.forEach(img => {
            img.classList.add('blurred-image');
        });
    }

    // Osserva i cambiamenti nel body per rilevare cambiamenti di tema
    function observeThemeChanges() {
        const observer = new MutationObserver(() => {
            applyTheme();  // Aggiorna il colore di sfondo quando cambia il tema
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    // Inizializza lo script
    function init() {
        document.addEventListener('mousemove', updateChatListVisibility);
        blurSentPhotos(); // Sfoca le foto inviate nei messaggi all'inizio
        document.addEventListener('DOMNodeInserted', blurSentPhotos); // Sfoca le nuove foto inviate aggiunte al DOM
        observeThemeChanges();  // Inizia a osservare i cambiamenti del tema
    }

    init();
})();
