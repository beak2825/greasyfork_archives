// ==UserScript==
// @name         Wallapop Contabilidad Compras y Ventas
// @namespace    Violentmonkey Scripts
// @author       Sergi0
// @version      1.4
// @description  Muestra dinámicamente información sobre ventas, compras y el monedero en Wallapop cuando se navega a las URL de compras y ventas finalizadas.
// @match        https://es.wallapop.com/*
// @grant        none
// @icon         https://es.wallapop.com/favicon.ico
// @language     es
// @license MIT
// @homepageURL  https://greasyfork.org/es/scripts/498072-wallapop-contabilidad-compras-y-ventas
// @supportURL   https://greasyfork.org/es/scripts/498072-wallapop-contabilidad-compras-y-ventas/feedback
// @downloadURL https://update.greasyfork.org/scripts/498072/Wallapop%20Contabilidad%20Compras%20y%20Ventas.user.js
// @updateURL https://update.greasyfork.org/scripts/498072/Wallapop%20Contabilidad%20Compras%20y%20Ventas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const yearToFind = '2025';
    let observer = null;
    const divId = 'info-script';

    const mostrarInfoScript = info => {
        let div = document.getElementById(divId);
        if (!div) {
            div = document.createElement('div');
            div.id = divId;
            div.style.cssText = `
                position: fixed;
                right: -50%;
                bottom: 25%;
                width: 440px;
                background-color: #1abc9c;
                opacity: 0;
                color: white;
                padding: 10px;
                text-align: left;
                z-index: 9999;
                font-weight: bold;
                white-space: pre-wrap;
                transition: opacity 2s ease, right 2s ease;
                border-radius:10px 0px 0px 10px;
            `;
            document.querySelector('.PrivateLayout__content').appendChild(div);
            div.offsetHeight; // Trigger reflow for transition
            div.style.opacity = '0.7';
            div.style.right = '0';
        }
        div.textContent = info.join('\n');
    };

    const mostrarInformacion = tipo => {
        const targetHeaderElement = Array.from(document.querySelectorAll('.HistoricList__header'))
            .find(header => header.textContent.trim().startsWith(yearToFind));

        if (!targetHeaderElement) {
            return;
        }

        const elements = targetHeaderElement.querySelectorAll('.HistoricList__element');
        const elementCount = elements.length;

        let envioCount = 0, totalVentasEnvio = 0, enPersonaCount = 0, totalVentasEnPersona = 0;

        elements.forEach(element => {
            const innerText = element.textContent.trim();
            const moneyAmountElement = element.querySelector('.HistoricElement__money-amount');

            if (moneyAmountElement) {
                const amount = parseFloat(moneyAmountElement.textContent.trim().replace('€', '').replace(',', '.'));
                if (innerText.includes('Envío')) {
                    envioCount++;
                    totalVentasEnvio += amount;
                } else if (innerText.includes('En persona')) {
                    enPersonaCount++;
                    totalVentasEnPersona += amount;
                }
            }
        });

        const info = [
            `Resumen de ${tipo} año ${yearToFind}`,
            '(Haz scroll hasta el año anterior para actualizar)',
            `Número de ${tipo}: ${elementCount}`,
            `Número de ${tipo} con envío: ${envioCount}`,
            `Total de ${tipo} con envío: ${totalVentasEnvio.toFixed(2)} €`,
            `Número de ${tipo} en persona: ${enPersonaCount}`,
            `Total de ${tipo} en persona: ${totalVentasEnPersona.toFixed(2)} €`,
            `Total de ${tipo} (con envío y en persona): ${(totalVentasEnvio + totalVentasEnPersona).toFixed(2)} €`,
        ];

        mostrarInfoScript(info);
    };

    const configurarObservador = tipo => {
        if (observer) {
            observer.disconnect();
        }

        let timeoutId = null;

        observer = new MutationObserver(mutations => {
            const ourDiv = document.getElementById(divId);
            const isOurMutation = mutations.some(mutation =>
                ourDiv && (ourDiv === mutation.target || ourDiv.contains(mutation.target))
            );

            if (isOurMutation) {
                return;
            }

            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                mostrarInformacion(tipo);
            }, 500);
        });
        observer.observe(document.body, { subtree: true, childList: true, attributes: true });
    };

    const handleUrlChange = () => {
        const currentUrl = window.location.href;

        if (currentUrl.includes('/app/selling/completed')) {
            mostrarInformacion('ventas');
            configurarObservador('ventas');
        } else if (currentUrl.includes('/app/purchases/completed')) {
            mostrarInformacion('compras');
            configurarObservador('compras');
        } else {
            const infoDiv = document.getElementById(divId);
            if (infoDiv) {
                infoDiv.style.opacity = '0';
                infoDiv.style.right = '-50%';
                setTimeout(() => infoDiv.remove(), 2000);
            }
            if (observer) {
                observer.disconnect();
            }
        }
    };

    ['pushState', 'replaceState'].forEach(type => {
        const original = history[type];
        history[type] = function(...args) {
            const ret = original.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };
    });

    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('locationchange', handleUrlChange);
    window.addEventListener('load', handleUrlChange);

})();