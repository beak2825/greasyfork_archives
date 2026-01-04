// ==UserScript==
// @name         WindowSwap - GeoGuessr Instantâneo
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Oculta a localização assim que uma nova janela carrega, sem vazamentos visuais. 🌍🪟⚡✅🔐
// @author       temidotela
// @license      MIT
// @match        https://www.window-swap.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541261/WindowSwap%20-%20GeoGuessr%20Instant%C3%A2neo.user.js
// @updateURL https://update.greasyfork.org/scripts/541261/WindowSwap%20-%20GeoGuessr%20Instant%C3%A2neo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let observer = null;
    let observerActive = false;

    function hideLocationOnce() {
        const locationEl = document.querySelector('a#location');

        if (locationEl && !document.querySelector('#reveal-location-button')) {
            const originalColor = getComputedStyle(locationEl).color;
            const originalShadow = getComputedStyle(locationEl).textShadow;

            locationEl.style.transition = 'color 0.6s ease, filter 0.6s ease';
            locationEl.style.color = 'transparent';
            locationEl.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
            locationEl.style.filter = 'blur(6px)';

            const button = document.createElement('button');
            button.id = 'reveal-location-button';
            button.textContent = '🔍 Revelar local';
            Object.assign(button.style, {
                position: 'fixed',
                top: '80px',
                right: '20px',
                zIndex: '99999',
                padding: '12px 18px',
                background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
                border: '1px solid #bbb',
                borderRadius: '10px',
                fontSize: '15px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
            });

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.background = 'linear-gradient(135deg, #ffffff, #dddddd)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.background = 'linear-gradient(135deg, #f5f5f5, #e0e0e0)';
            });

            button.addEventListener('click', () => {
                locationEl.style.color = originalColor;
                locationEl.style.textShadow = originalShadow;
                locationEl.style.filter = 'none';

                button.style.opacity = '0';
                button.style.transition = 'opacity 0.3s ease';
                setTimeout(() => button.remove(), 300);

                if (observer && observerActive) {
                    observer.disconnect();
                    observerActive = false;
                }
            });

            document.body.appendChild(button);
        }
    }

    function waitForNewLocationAndHide() {
        const checkInterval = setInterval(() => {
            const locationEl = document.querySelector('a#location');

            if (locationEl && locationEl.textContent.trim().length > 0 && !document.querySelector('#reveal-location-button')) {
                clearInterval(checkInterval);
                hideLocationOnce();
                setupObserver(); // reativa o ciclo
            }
        }, 50);
    }

    function setupObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            hideLocationOnce();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        observerActive = true;
    }

    function setupNewWindowButtonListener() {
        const tryFindButton = () => {
            const newWindowBtn = [...document.querySelectorAll('button')]
                .find(btn => btn.textContent?.includes("Open a window"));

            if (newWindowBtn && !newWindowBtn.dataset.geoGuessrHooked) {
                newWindowBtn.dataset.geoGuessrHooked = 'true';

                newWindowBtn.addEventListener('click', () => {
                    // 🧠 Aguarda o novo local ser carregado de fato
                    waitForNewLocationAndHide();
                });
            }
        };

        tryFindButton();
        const interval = setInterval(tryFindButton, 1000);
        setTimeout(() => clearInterval(interval), 15000);
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            hideLocationOnce();
            setupObserver();
            setupNewWindowButtonListener();
        }, 500);
    });
})();
