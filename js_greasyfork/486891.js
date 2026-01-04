// ==UserScript==
// @name         Cookie Clicker Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cookie Clicker Helper Menu
// @icon         https://cdn.dashnet.org/cookieclicker/img/goldCookie.png
// @author       You
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486891/Cookie%20Clicker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486891/Cookie%20Clicker%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCookies() {
        Game.cookies += 5000;
    }

    function resetCookies() {
        Game.cookies = 0;
    }

    function resetgame() {
        Game.HardReset(2);
    }

    function createGUI() {
        const gui = document.createElement('div');
        gui.id = 'mod-menu';
        gui.style.position = 'fixed';
        gui.style.top = '10px';
        gui.style.left = '10px';
        gui.style.zIndex = '9999';
        gui.style.background = 'rgba(0, 0, 0, 0.5)';
        gui.style.color = 'white';
        gui.style.padding = '10px';
        gui.style.borderRadius = '5px';
        gui.style.cursor = 'move';
        gui.innerHTML = `
            <div style="font-weight: bold;">Mod Menu</div>
            <button id="add-cookies-button">Add 5000 Cookies</button><br>
            <button id="reset-cookies-button">Reset Cookies</button><br>
            <button id="reset-game-button">Reset Game</button>
        `;
        document.body.appendChild(gui);

        let offsetX, offsetY;
        let dragging = false;

        gui.addEventListener('mousedown', function(e) {
            dragging = true;
            offsetX = e.clientX - gui.getBoundingClientRect().left;
            offsetY = e.clientY - gui.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', function(e) {
            if (dragging) {
                gui.style.left = (e.clientX - offsetX) + 'px';
                gui.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            dragging = false;
        });

        const addButton = document.getElementById('add-cookies-button');
        addButton.addEventListener('click', addCookies);

        const resetButton = document.getElementById('reset-cookies-button');
        resetButton.addEventListener('click', resetCookies);

        const resetgameButton = document.getElementById('reset-game-button');
        resetgameButton.addEventListener('click', resetgame);
    }

    const checkLoaded = setInterval(function() {
        if (typeof Game !== 'undefined' && Game.ready) {
            clearInterval(checkLoaded);
            createGUI();
        }
    }, 1000);
})();
