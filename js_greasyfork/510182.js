// ==UserScript==
// @name         CarManiac's Mute Feature
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Allows you to mute other players!
// @author       CarManiac
// @run-at       document-idle
// @license      MIT
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510182/CarManiac%27s%20Mute%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/510182/CarManiac%27s%20Mute%20Feature.meta.js
// ==/UserScript==

(function() {
    'use strict';

      const targetImage = 'graphics/ui/hitbox.svg';
    const newImageSrc = 'https://i.ibb.co/F5RLpmx/hitbox-1.png';

    const images = document.querySelectorAll(`img[src="${targetImage}"]`);

    images.forEach(img => {
        const overlayImage = document.createElement('img');
        overlayImage.src = newImageSrc;
        overlayImage.style.position = 'absolute';
        overlayImage.style.left = img.offsetLeft + 'px';
        overlayImage.style.top = img.offsetTop + 'px';
        overlayImage.style.width = img.width + 'px';
        overlayImage.style.height = img.height + 'px';
        overlayImage.style.pointerEvents = 'none';
        img.parentNode.appendChild(overlayImage);
    });


    const mutedPlayers = new Set(loadMutedPlayers());
    let players = [];
    let WSS;
    let myid;
    let hostId;

    function findPlayer(id) {
        for (let t in players) {
            let o = players[t];
            if (o.id == id || o.name == id) {
                o.index = t;
                return o;
            }
        }
    }

    const originalSend = window.WebSocket.prototype.send;

    window.WebSocket.prototype.send = async function(args) {
        if (this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")) {
            if (typeof (args) === "string") {
                if (!WSS) {
                    WSS = this;
                }
            }
        }
        if (WSS == this && !this.carInjected) {
            this.carInjected = true;
            const originalClose = this.onclose;
            this.onclose = (...args) => {
                if (WSS == this) {
                    WSS = 0;
                    players = [];
                }
                originalClose.call(this, ...args);
            };
            this.onmessageCar = this.onmessage;
            this.onmessage = function(event) {
                if (event.data.startsWith('42[')) {
                    let packet = JSON.parse(event.data.slice(2, event.data.length));
                    if (packet[0] == 7) {
                        myid = packet[1][0];
                        hostId = packet[1][1];
                        for (let i of packet[1][3]) {
                            players.push({
                                "team": i[2],
                                "color": (i[7][0] || i[7][1]),
                                "name": i[0],
                                "id": i[4],
                                "lvl": i[6]
                            });
                        }
                    }
                    if (packet[0] == 9) {
                        hostId = packet[2];
                    }
                    if (packet[0] == 45) {
                        hostId = packet[1];
                    }
                    if (packet[0] == 29) {
                        if (mutedPlayers.has(findPlayer(packet[1]).name)) {
                            return;
                        }
                    }
                    if (packet[0] == 8) {
                        players.push({
                            "name": packet[1][0],
                            "color": (packet[7] ? (packet[7][1] || packet[7][0]) : undefined),
                            "team": packet[1][2],
                            "id": packet[1][4],
                            "lvl": packet[1][6]
                        });
                    }
                }
                this.onmessageCar(event);
            };
        }
        return originalSend.call(this, args);
    };

    function loadMutedPlayers() {
        const storedMutedPlayers = localStorage.getItem('mutedPlayers');
        return storedMutedPlayers ? JSON.parse(storedMutedPlayers) : [];
    }

    function saveMutedPlayers() {
        localStorage.setItem('mutedPlayers', JSON.stringify(Array.from(mutedPlayers)));
    }

    function createMuteItem(playerName) {
        const muteItem = document.createElement('div');
        muteItem.className = 'item muteButton';
        muteItem.textContent = mutedPlayers.has(playerName) ? 'Unmute' : 'Mute';

        muteItem.style.paddingLeft = '20px';
        muteItem.style.paddingRight = '20px';
        muteItem.style.backgroundColor = '#2b2d31';
        muteItem.style.height = '28px';
        muteItem.style.lineHeight = '28px';
        muteItem.style.color = '#ebebeb';
        muteItem.style.fontSize = '15px';
        muteItem.style.cursor = 'pointer';

        muteItem.addEventListener('click', () => {
            if (mutedPlayers.has(playerName)) {
                mutedPlayers.delete(playerName);
                muteItem.textContent = 'Mute';
            } else {
                mutedPlayers.add(playerName);
                muteItem.textContent = 'Unmute';
            }
            saveMutedPlayers();
        });

        return muteItem;
    }

    let lastSelected;

    const observer = new MutationObserver((e) => {
        for (let i of e) {
            if (i.target.classList.contains('sideContainer') || i.target.classList.contains('elementContainer')) {
                for (let x of i.target.children) {
                    if (x.classList.contains('playerElement') && !x.injected) {
                        x.injected = true;
                        const y = () => {
                            lastSelected = x;
                            console.log('selected');
                        };
                        x.addEventListener("mouseup", y);
                        x.addEventListener("mousedown", y);
                        x.addEventListener("click", y);
                    }
                }
            }
        }
        const menu = document.querySelector('.rightClickMenu .container');
        if (menu) {
            const existingMuteItem = Array.from(menu.children).find(item => item.textContent === 'Mute' || item.textContent === 'Unmute');
            if (!existingMuteItem) {
                let playerName = lastSelected.querySelector("div.name").textContent;
                const muteItem = createMuteItem(playerName);
                menu.appendChild(muteItem);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function extractPlayerNameFromMessage(messageElement) {
        const nameSpan = messageElement.querySelector('.name');
        return nameSpan ? nameSpan.textContent.trim().slice(0, -1) : null;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .muteButton:hover {
            background-color: #323438 !important;
        }
    `;
    document.head.appendChild(style);

})();
