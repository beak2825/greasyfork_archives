// ==UserScript==
// @name         NHL Gamecenter tlačítka
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Generuje tlačítka pro přístup k živým URL na stránce s rozpisem NHL
// @author       Michal
// @match        https://www.nhl.com/schedule/*
// @match        https://www.nhl.com/schedule
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512729/NHL%20Gamecenter%20tla%C4%8D%C3%ADtka.user.js
// @updateURL https://update.greasyfork.org/scripts/512729/NHL%20Gamecenter%20tla%C4%8D%C3%ADtka.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateButtons() {
        const allRows = document.querySelectorAll('tr');

        allRows.forEach((row, index) => {
            const links = row.querySelectorAll('a');

            links.forEach((link) => {
                if (link.textContent.trim() === 'Gamecenter') {
                    const href = link.href;
                    console.log(`Řádek ${index + 1}: Nalezen odkaz Gamecenter: ${href}`);

                    const gameId = href.match(/(\d{6})$/);
                    if (gameId) {
                        const gameCode = gameId[0].slice(-6);
                        console.log(`Řádek ${index + 1}: Extrahovaný kód hry: ${gameCode}`);

                        const gsUrl = `https://www.nhl.com/scores/htmlreports/20242025/GS${gameCode}.HTM`;
                        const esUrl = `https://www.nhl.com/scores/htmlreports/20242025/ES${gameCode}.HTM`;
                        console.log(`Řádek ${index + 1}: Generované URL: GS - ${gsUrl}, ES - ${esUrl}`);

                        let buttonContainer = link.parentNode.querySelector('.button-container');
                        if (!buttonContainer) {
                            buttonContainer = document.createElement('div');
                            buttonContainer.className = 'button-container';
                            buttonContainer.style.display = 'flex';
                            buttonContainer.style.alignItems = 'center'; // Vertikální zarovnání
                            buttonContainer.style.marginLeft = '5px'; // Přidání mezery vlevo
                            link.parentNode.insertBefore(buttonContainer, link.nextSibling);
                        }

                        let gsLink = buttonContainer.querySelector('.custom-button-gs');
                        let esLink = buttonContainer.querySelector('.custom-button-es');
                        let gameCodeElement = buttonContainer.querySelector('.game-code');

                        if (!gsLink) {
                            gsLink = document.createElement('button');
                            gsLink.className = 'custom-button-gs';
                            gsLink.style.backgroundColor = '#0055e9';
                            gsLink.style.color = '#ffffff';
                            gsLink.style.padding = '5px 10px';
                            gsLink.style.marginRight = '5px';
                            gsLink.style.border = 'none';
                            gsLink.style.borderRadius = '4px';
                            gsLink.style.fontSize = '12px';
                            gsLink.style.cursor = 'pointer';
                            gsLink.textContent = 'GS';

                            gsLink.addEventListener('click', () => {
                                history.pushState(null, '', gsUrl);
                            });

                            buttonContainer.appendChild(gsLink);
                        }

                        if (!esLink) {
                            esLink = document.createElement('button');
                            esLink.className = 'custom-button-es';
                            esLink.style.backgroundColor = '#0055e9';
                            esLink.style.color = '#ffffff';
                            esLink.style.padding = '5px 10px';
                            esLink.style.marginRight = '5px';
                            esLink.style.border = 'none';
                            esLink.style.borderRadius = '4px';
                            esLink.style.fontSize = '12px';
                            esLink.style.cursor = 'pointer';
                            esLink.textContent = 'ES';

                            esLink.addEventListener('click', () => {
                                history.pushState(null, '', esUrl);
                            });

                            buttonContainer.appendChild(esLink);
                        }

                        if (!gameCodeElement) {
                            gameCodeElement = document.createElement('span');
                            gameCodeElement.className = 'game-code';
                            gameCodeElement.style.marginLeft = '10px';
                            gameCodeElement.style.fontSize = '12px';
                            gameCodeElement.style.color = '#0055e9';
                            gameCodeElement.textContent = `ID zápasu: ${gameCode}`;

                            buttonContainer.appendChild(gameCodeElement);
                        }
                    } else {
                        console.log(`Řádek ${index + 1}: Kód hry nebyl nalezen v URL: ${href}`);
                    }
                }
            });
        });
    }

    generateButtons();

    const observer = new MutationObserver(generateButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();