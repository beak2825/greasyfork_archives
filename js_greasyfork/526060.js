// ==UserScript==
// @name         Smash Karts Wapen Kiezer (met menu)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Kies je eigen wapen in Smash Karts met een menu!
// @author       JouwNaam
// @match        *://smashkarts.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526060/Smash%20Karts%20Wapen%20Kiezer%20%28met%20menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526060/Smash%20Karts%20Wapen%20Kiezer%20%28met%20menu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lijst met wapens (de ID's kunnen per update veranderen)
    const wapens = [
        { naam: "Machine Gun", id: "MachineGun" },
        { naam: "Rocket Launcher", id: "RocketLauncher" },
        { naam: "Mines", id: "Mines" },
        { naam: "Shield", id: "Shield" },
        { naam: "Boost", id: "Boost" },
        { naam: "Shotgun", id: "Shotgun" }
    ];

    let menuOpen = false;

    // Creeër het menu
    const menu = document.createElement("div");
    menu.id = "wapenMenu";
    menu.style.position = "fixed";
    menu.style.top = "50px";
    menu.style.right = "50px";
    menu.style.background = "rgba(0,0,0,0.8)";
    menu.style.color = "white";
    menu.style.padding = "10px";
    menu.style.borderRadius = "10px";
    menu.style.display = "none";
    menu.style.zIndex = "1000";

    // Voeg wapens toe aan het menu
    wapens.forEach(wapen => {
        let knop = document.createElement("button");
        knop.innerText = wapen.naam;
        knop.style.display = "block";
        knop.style.margin = "5px";
        knop.style.padding = "10px";
        knop.style.border = "none";
        knop.style.background = "#ff9800";
        knop.style.color = "white";
        knop.style.cursor = "pointer";
        knop.style.borderRadius = "5px";
        knop.style.width = "150px";
        knop.onclick = function() {
            geefWapen(wapen.id);
        };
        menu.appendChild(knop);
    });

    document.body.appendChild(menu);

    // Toetsenbord event listener
    document.addEventListener("keydown", function(event) {
        if (event.key.toLowerCase() === "g") {
            event.preventDefault();
            event.stopPropagation();
            menuOpen = !menuOpen;
            menu.style.display = menuOpen ? "block" : "none";
        }
    });

    // Functie om het wapen te geven
    function geefWapen(wapenId) {
        let speler = Object.values(game.players).find(p => p.isLocal);
        if (speler) {
            speler.weapon = new game.weapons[wapenId](speler);
            console.log("Wapen geselecteerd:", wapenId);
            menu.style.display = "none";
            menuOpen = false;
        }
    }
})();
