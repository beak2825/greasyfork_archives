// ==UserScript==
// @name         Block notRemoverPopup (examtopics fix)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Blokuje <div id="notRemoverPopup"> na examtopics.com i innych stronach
// @match        https://www.examtopics.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537120/Block%20notRemoverPopup%20%28examtopics%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537120/Block%20notRemoverPopup%20%28examtopics%20fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePopupIfExists() {
        const popup = document.getElementById('notRemoverPopup');
        if (popup) {
            console.warn('🔥 Usunięto notRemoverPopup');
            popup.remove();
        }
    }

    // 1. Co sekundę przez pierwsze 30 sekund sprawdzamy obecność elementu
    let counter = 0;
    const interval = setInterval(() => {
        removePopupIfExists();
        counter++;
        if (counter > 30) clearInterval(interval);
    }, 1000);

    // 2. Obserwujemy też DOM na wypadek gdyby popup pojawił się później
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.id === 'notRemoverPopup') {
                    console.warn('🚫 Wykryto i usunięto notRemoverPopup (observer)');
                    node.remove();
                }
            }
        }
    });

    const tryObserve = () => {
        const target = document.body;
        if (target) {
            observer.observe(target, {
                childList: true,
                subtree: true,
            });
        } else {
            // Spróbuj ponownie za chwilę, jeśli body nie jest jeszcze gotowe
            setTimeout(tryObserve, 500);
        }
    };

    tryObserve();
})();