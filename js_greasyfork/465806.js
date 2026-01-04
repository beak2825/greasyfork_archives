// ==UserScript==
// @name         Player-List Mod (Draggable) | Shell Shockers | flyg0n LiTe
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Adds a draggable player list to the shell shockers game UI. Shows paused players and players hp.
// @author       flyg0n LiTe
// @match        https://shellshock.io/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.life/*
// @icon         https://www.berrywidgets.com/assets/health-bar2.png
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465806/Player-List%20Mod%20%28Draggable%29%20%7C%20Shell%20Shockers%20%7C%20flyg0n%20LiTe.user.js
// @updateURL https://update.greasyfork.org/scripts/465806/Player-List%20Mod%20%28Draggable%29%20%7C%20Shell%20Shockers%20%7C%20flyg0n%20LiTe.meta.js
// ==/UserScript==

(function() {
    'use strict';

 GM_addStyle(`
    #playerHealthContainer {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        color: white;
        font-size: 14px;
        background-color: #DB5A48;
        font-family: 'Kanit', sans-serif;
        padding: 5px;
        cursor: grab;
        margin: 5px;
    }
    .changeColor {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1001;
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        outline: none;
    }
`);

    // Add a container to display the health
    const playerHealthContainer = document.createElement('div');
    playerHealthContainer.id = 'playerHealthContainer';
    document.body.appendChild(playerHealthContainer);

    function sortByHealth(a, b) {
        if (a.hp > b.hp) {
            return -1;
        }
        if (a.hp < b.hp) {
            return 1;
        }
        return 0;
    }

    function updateHealthDisplay() {
        let playersArray = Array.from(window.players.values());
        playersArray.sort(sortByHealth);

        let healthInfo = '';
        playersArray.forEach((player) => {
             healthInfo += `${player.name}: ${player.hp === 0 ? 'Paused' : (player.hp).toFixed(2) + ' HP'}<br>`;
        });
        playerHealthContainer.innerHTML = healthInfo;
    }

    // Store player data
    window.players = new Map();

    // Intercept push method to store player data
    const originalPush = Array.prototype.push;
    Array.prototype.push = function(data) {
        try {
            if (arguments[0].player && arguments[0].id) {
                const playerProxy = new Proxy(arguments[0].player, {
                    set: (target, property, value) => {
                        target[property] = value;
                        if (property === 'hp') {
                            updateHealthDisplay();
                        }
                        return true;
                    },
                });
                window.players.set(playerProxy.id, playerProxy);
                updateHealthDisplay();
            }
        } catch (e) {
            console.log(e);
        }
        return originalPush.apply(this, arguments);
    };

    // Add color picker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.style.display = 'none';
    colorPicker.onchange = () => {
        playerHealthContainer.style.backgroundColor = colorPicker.value;
    };
    document.body.appendChild(colorPicker);

    // Add change color button
    const changeColorBtn = document.createElement('button');
    changeColorBtn.className = 'changeColor';
    changeColorBtn.innerHTML = '&#9881;';
    changeColorBtn.onclick = () => {
        colorPicker.click();
    };
    document.body.appendChild(changeColorBtn);

    // Load Google Fonts
    const googleFontLink = document.createElement('link');
    googleFontLink.href = 'https://fonts.googleapis.com/css2?family=Kanit&display=swap';
googleFontLink.rel = 'stylesheet';
document.head.appendChild(googleFontLink);
    // Make the playerHealthContainer draggable
playerHealthContainer.addEventListener('mousedown', (event) => {
    event.preventDefault();
    const offsetX = event.clientX - playerHealthContainer.getBoundingClientRect().left;
    const offsetY = event.clientY - playerHealthContainer.getBoundingClientRect().top;

    const onMouseMove = (event) => {
        playerHealthContainer.style.left = `${event.clientX - offsetX}px`;
        playerHealthContainer.style.top = `${event.clientY - offsetY}px`;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});
})();


