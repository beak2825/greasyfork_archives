// ==UserScript==
// @name         Smash Karts Wapenmenu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Kies je eigen wapens in Smash Karts met een menu (druk op 'G')
// @author       JouwNaam
// @match        *://smashkarts.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526091/Smash%20Karts%20Wapenmenu.user.js
// @updateURL https://update.greasyfork.org/scripts/526091/Smash%20Karts%20Wapenmenu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let gameInstance = null;

    function findGameInstance() {
        let allObjects = Object.values(window);
        for (let obj of allObjects) {
            if (obj && obj.players && obj.addEventListener) {
                gameInstance = obj;
                console.log("✅ Game-instantie gevonden!", gameInstance);
                return;
            }
        }
        console.log("❌ Game niet gevonden!");
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
        if (!gameInstance) {
            alert("Game niet gevonden! Probeer opnieuw.");
            return;
        }

        let player = Object.values(gameInstance.players)[0];
        if (!player) {
            alert("Speler niet gevonden!");
            return;
        }

        player.inventory.push(weapon);
        alert(`${weapon} geselecteerd!`);
    }

    setTimeout(() => {
        findGameInstance();
        createWeaponMenu();
    }, 5000);
})();
