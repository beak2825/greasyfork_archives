// ==UserScript==
// @name         helperPvP2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  рп
// @author       matrosik (Drik)
// @match        https://cavegame.io/
// @icon https://i.postimg.cc/nLbFxnNg/image.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536522/helperPvP2.user.js
// @updateURL https://update.greasyfork.org/scripts/536522/helperPvP2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeBackgroundColor() {
        document.body.style.backgroundColor = 'transparent';

        const menu = document.getElementById('craft-modal');
        if (menu) {
            menu.style.backgroundColor = '#FF1493';
            menu.style.color = 'white';
        }

        const elementsToStyle = [
            'buy-item',
            'buy-item-2',
            'sell-step-1',
            'xp-bar'
        ];

        elementsToStyle.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.backgroundColor = '#FF1493';
                element.style.color = 'white';
            }
        });

        const headers = document.querySelectorAll('h3');
        headers.forEach(header => {
            header.style.color = 'white';
            header.style.backgroundColor = '#FF1493';
        });

        const shopTabs = document.querySelectorAll('.shop-tab-button');
        shopTabs.forEach(tab => {
            tab.style.backgroundColor = '#FF1493';
        });

        const elementsToRemove = [
            document.querySelector('.view-instructions-container'),
            document.getElementById('bottom-links'),
            document.querySelector('.mini-modal.modal.limited')
        ];

        elementsToRemove.forEach(element => {
            if (element) {
                element.remove();
            }
        });

        createPositionMenu();
    }

    function createPositionMenu() {
        const existingMenu = document.getElementById('player-position-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const positionMenu = document.createElement('div');
        positionMenu.id = 'player-position-menu';
        positionMenu.style.position = 'fixed';
        positionMenu.style.top = '10px';
        positionMenu.style.left = '10px';
        positionMenu.style.backgroundColor = '#FF1493';
        positionMenu.style.color = 'white';
        positionMenu.style.padding = '10px';
        positionMenu.style.borderRadius = '8px';
        positionMenu.style.zIndex = '1000';
        positionMenu.style.fontFamily = 'Arial, sans-serif';
        positionMenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        const title = document.createElement('h3');
        title.innerText = 'press F1 ';
        title.style.margin = '0';
        positionMenu.appendChild(title);

        const positionDisplay = document.createElement('div');
        positionDisplay.id = 'current-position';
        positionDisplay.innerText = 'help координаты: 0, 0';
        positionMenu.appendChild(positionDisplay);

        document.body.appendChild(positionMenu);
        trackPlayerPosition();
    }

    function trackPlayerPosition() {
        const positionElement = document.querySelector('.player-position.no-select');
        const positionDisplay = document.getElementById('current-position');

        if (!positionElement || !positionDisplay) return;

        const updatePosition = () => {
            const positionText = positionElement.innerText;
            positionDisplay.innerText = `Cord: ${positionText}`;
        };

        updatePosition();
        setInterval(updatePosition, 0);

        window.addEventListener("keydown", function(e) {
            if (e.key.toLowerCase() === "f1") {
                e.preventDefault();
                const coordsElem = document.querySelector('.player-position.no-select');
                const chatInput = document.querySelector('#chat-input');
                if (coordsElem && chatInput) {
                    const coords = `(code matrosika) help pls: ${coordsElem.textContent.trim()}`;
                    let tEvent = new KeyboardEvent('keydown', {
                        key: "t",
                        code: "KeyT",
                        keyCode: 84,
                        which: 84,
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(tEvent);

                    setTimeout(() => {
                        chatInput.value = coords;
                        const enterEvent = new KeyboardEvent('keydown', {
                            key: "Enter",
                            code: "Enter",
                            keyCode: 13,
                            which: 13,
                            bubbles: true,
                            cancelable: true
                        });
                        chatInput.dispatchEvent(enterEvent);
                    }, 0);
                }
            }
        });
    }

    window.addEventListener('load', changeBackgroundColor);
})();