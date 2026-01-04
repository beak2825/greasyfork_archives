// ==UserScript==
// @name         Courtside
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Přidá tlačítko
// @author       Michal
// @match        https://www.courtside1891.basketball/games
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500275/Courtside.user.js
// @updateURL https://update.greasyfork.org/scripts/500275/Courtside.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const gameElements = document.querySelectorAll('[data-game-id]');

        gameElements.forEach(el => {
            const gameId = el.getAttribute('data-game-id');

            const createButton = (text, url) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.style.padding = '10px 20px';
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.cursor = 'pointer';
                button.style.borderRadius = '5px';
                button.style.margin = '5px';
                button.style.fontSize = '14px';

                button.addEventListener('click', () => {
                    window.location.href = url;
                });

                button.addEventListener('auxclick', (event) => {
                    if (event.button === 1 || event.ctrlKey) {
                        window.open(url, '_blank');
                    }
                });

                return button;
            };

            const scoreUrl = `https://sportsdata.courtside1891.basketball/sportzapi/v1/en/games/${gameId}`;
            const statsUrl = `${scoreUrl}#noscore`;

            const scoreButton = createButton('Skóre', scoreUrl);
            const statsButton = createButton('Statistiky', statsUrl);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.marginTop = '15px';
            buttonsContainer.style.borderTop = '1px solid #ddd';
            buttonsContainer.style.paddingTop = '10px';
            buttonsContainer.style.textAlign = 'center';

            buttonsContainer.appendChild(scoreButton);
            buttonsContainer.appendChild(statsButton);

            const arrow = document.createElement('div');
            arrow.style.width = '0';
            arrow.style.height = '0';
            arrow.style.borderLeft = '10px solid transparent';
            arrow.style.borderRight = '10px solid transparent';
            arrow.style.borderTop = '10px solid #4CAF50';
            arrow.style.margin = '0 auto';
            arrow.style.marginBottom = '5px';

            const container = document.createElement('div');
            container.style.textAlign = 'center';
            container.appendChild(arrow);
            container.appendChild(buttonsContainer);

            el.appendChild(container);
        });
    }, 3000);
})();