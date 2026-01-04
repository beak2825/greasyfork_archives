// ==UserScript==
// @name         AutoCraft(EN_VERSION)
// @namespace    http://tampermonkey.net/
// @version      3.1415
// @description  Auto craft system. If you only need to craft stews (for example), you can set all other parameters to 0 or 1. They simply won't be crafted if you don't have the resources.
// @author       Drik
// @match        https://cavegame.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527723/AutoCraft%28EN_VERSION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527723/AutoCraft%28EN_VERSION%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let menu = document.createElement('div');
    menu.style = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    menu.innerHTML = `
        <label for="craftDoorsCount">Craft Doors:</label>
        <input type="number" id="craftDoorsCount" min="1" value="1" style="width: 50px; margin-right: 10px;">
        <br>
        <label for="craftBarriersCount">Craft Barriers:</label>
        <input type="number" id="craftBarriersCount" min="1" value="1" style="width: 50px; margin-right: 10px;">
        <br>
        <label for="craftGeneratorsCount">Craft Gold Generators:</label>
        <input type="number" id="craftGeneratorsCount" min="1" value="1" style="width: 50px; margin-right: 10px;">
        <br>
        <label for="craftArrowsCount">Craft Arrows:</label>
        <input type="number" id="craftArrowsCount" min="1" value="1" style="width: 50px; margin-right: 10px;">
        <br>
        <label for="craftStewsCount">Craft Stews:</label>
        <input type="number" id="craftStewsCount" min="1" value="1" style="width: 50px; margin-right: 10px;">
        <br>
        <button id="startCrafting">Craft</button>
    `;
    document.body.appendChild(menu);


    menu.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {

            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });

    document.getElementById('startCrafting').onclick = () => {
        let doorsCount = parseInt(document.getElementById('craftDoorsCount').value);
        let barriersCount = parseInt(document.getElementById('craftBarriersCount').value);
        let generatorsCount = parseInt(document.getElementById('craftGeneratorsCount').value);
        let arrowsCount = parseInt(document.getElementById('craftArrowsCount').value);
        let stewsCount = parseInt(document.getElementById('craftStewsCount').value);

        let craftButtons = {
            doors: document.querySelector("div.inventory.overlay-inventory[data-type='vault-door']"),
            barriers: document.querySelector("div.inventory.overlay-inventory[data-type='barrier']"),
            generators: document.querySelector("div.inventory.overlay-inventory[data-type='gold-generator']"),
            arrows: document.querySelector("div.inventory.overlay-inventory[data-type='arrow']"),
            stews: document.querySelector("div.inventory.overlay-inventory[data-type='stew']")
        };

        if (doorsCount > 0 && !craftButtons.doors) {
            alert('Craft button for doors not found!');
            return;
        }
        if (barriersCount > 0 && !craftButtons.barriers) {
            alert('Craft button for barriers not found!');
            return;
        }
        if (generatorsCount > 0 && !craftButtons.generators) {
            alert('Craft button for gold generators not found!');
            return;
        }
        if (arrowsCount > 0 && !craftButtons.arrows) {
            alert('Craft button for arrows not found!');
            return;
        }
        if (stewsCount > 0 && !craftButtons.stews) {
            alert('Craft button for stews not found!');
            return;
        }

        for (let i = 0; i < doorsCount; i++) {
            craftButtons.doors && craftButtons.doors.click();
        }

        for (let i = 0; i < barriersCount; i++) {
            craftButtons.barriers && craftButtons.barriers.click();
        }

        for (let i = 0; i < generatorsCount; i++) {
            craftButtons.generators && craftButtons.generators.click();
        }

        for (let i = 0; i < arrowsCount; i++) {
            craftButtons.arrows && craftButtons.arrows.click();
        }

        for (let i = 0; i < stewsCount; i++) {
            craftButtons.stews && craftButtons.stews.click();
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F9') {
            menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
        }
    });
})();
