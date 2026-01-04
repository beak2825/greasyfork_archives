// ==UserScript==
// @name         Smash Karts Wapen Kiezer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Kies je eigen wapen in Smash Karts!
// @author       JouwNaam
// @match        *://smashkarts.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526071/Smash%20Karts%20Wapen%20Kiezer.user.js
// @updateURL https://update.greasyfork.org/scripts/526071/Smash%20Karts%20Wapen%20Kiezer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getGameInstance() {
        return window.game || Object.values(window).find(obj => obj && obj.players);
    }

    function createWeaponMenu() {
        let menu = document.createElement("div");
        menu.id = "weapon-menu";
        menu.style.position = "fixed";
        menu.style.top = "50px";
        menu.style.left = "50px";
        menu.style.background = "rgba(0,0,0,0.8)";
        menu.style.padding = "10px";
        menu.style.borderRadius = "10px";
        menu.style.color = "white";
        menu.style.fontSize = "16px";
        menu.style.zIndex = "9999";
        menu.style.display = "none";

        let weapons = ["Minigun", "Raket", "Mijnen", "Shotgun", "Sniper"];

        weapons.forEach(weapon => {
            let btn = document.createElement("button");
            btn.innerText = weapon;
            btn.style.display = "block";
            btn.style.margin = "5px";
            btn.style.padding = "5px";
            btn.style.background = "#ff6600";
            btn.style.border = "none";
            btn.style.color = "white";
            btn.style.cursor = "pointer";
            btn.onclick = () => selectWeapon(weapon);
            menu.appendChild(btn);
        });

        document.body.appendChild(menu);

        document.addEventListener("keydown", function(event) {
            if (event.key === "G" || event.key === "g") {
                menu.style.display = menu.style.display === "none" ? "block" : "none";
            }
        });
    }

    function selectWeapon(weapon) {
        let game = getGameInstance();
        if (!game) return alert("Game niet gevonden!");

        let player = Object.values(game.players)[0]; 
        if (!player) return alert("Speler niet gevonden!");

        player.inventory.push(weapon);
        alert(`${weapon} geselecteerd!`);
    }

    setTimeout(createWeaponMenu, 3000);
})();
