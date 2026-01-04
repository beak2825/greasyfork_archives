// ==UserScript==
// @license MIT
// @name         Survev.io Cheat Menu Enhanced
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Enhanced cheat menu with improved GUI, aimbot, ESP, grenade radius, spinbot, kill counter, and anti-detection measures.
// @author       JavaScript AI
// @match        *://survev.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528876/Survevio%20Cheat%20Menu%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/528876/Survevio%20Cheat%20Menu%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings for various cheat features
    let settings = {
        esp: false,
        spinbot: false,
        aimbot: false,
        explosionRadius: true,
        grenadeTimer: true,
        healthIndicator: true,
        adrenalineIndicator: true,
        lobbyBackground: true
    };

    // Create and style the cheat menu GUI
    function createGUI() {
        let gui = document.createElement("div");
        gui.id = "cheatMenu";
        // Set styles individually
        gui.style.position = "fixed";
        gui.style.top = "50px";
        gui.style.left = "10px";
        gui.style.background = "rgba(0, 0, 0, 0.9)";
        gui.style.color = "white";
        gui.style.padding = "15px";
        gui.style.zIndex = "9999";
        gui.style.borderRadius = "8px";
        gui.style.fontFamily = "Arial, sans-serif";
        gui.style.fontSize = "14px";
        gui.style.boxShadow = "0px 0px 10px rgba(0, 255, 0, 0.7)";
        gui.style.width = "200px";

        // Title
        let title = document.createElement("b");
        title.innerText = "Survev.io Cheat Menu";
        title.style.color = "lime";
        gui.appendChild(title);
        gui.appendChild(document.createElement("br"));

        // Utility function to create a button
        function createButton(id, text) {
            let btn = document.createElement("button");
            btn.id = id;
            btn.innerText = text;
            btn.style.width = "100%";
            btn.style.margin = "5px 0";
            btn.style.padding = "5px";
            btn.style.border = "none";
            btn.style.borderRadius = "5px";
            btn.style.background = "#444";
            btn.style.color = "white";
            btn.style.cursor = "pointer";
            btn.style.transition = "0.3s";
            return btn;
        }

        // Create buttons for features (hide menu option removed)
        let btnESP = createButton("toggleESP", "ESP: OFF");
        let btnSpinbot = createButton("toggleSpinbot", "Spinbot: OFF");
        let btnAimbot = createButton("toggleAimbot", "Aimbot: OFF");
        let btnExplosion = createButton("toggleExplosion", "Explosion Radius: ON");
        let btnGrenade = createButton("toggleGrenade", "Grenade Timer: ON");
        let btnHealth = createButton("toggleHealth", "Health Indicator: ON");
        let btnAdrenaline = createButton("toggleAdrenaline", "Adrenaline Indicator: ON");
        let btnLobbyBG = createButton("toggleBG", "Lobby Background: ON");

        // Append buttons to the GUI
        gui.appendChild(btnESP);
        gui.appendChild(btnSpinbot);
        gui.appendChild(btnAimbot);
        gui.appendChild(btnExplosion);
        gui.appendChild(btnGrenade);
        gui.appendChild(btnHealth);
        gui.appendChild(btnAdrenaline);
        gui.appendChild(btnLobbyBG);

        document.body.appendChild(gui);

        // Toggle feature function
        function toggleFeature(name, button) {
            settings[name] = !settings[name];
            button.innerText = name.charAt(0).toUpperCase() + name.slice(1) + ": " + (settings[name] ? "ON" : "OFF");
            button.style.background = settings[name] ? "lime" : "#444";
        }

        // Set event listeners for buttons
        btnESP.onclick = () => toggleFeature("esp", btnESP);
        btnSpinbot.onclick = () => toggleFeature("spinbot", btnSpinbot);
        btnAimbot.onclick = () => toggleFeature("aimbot", btnAimbot);
        btnExplosion.onclick = () => toggleFeature("explosionRadius", btnExplosion);
        btnGrenade.onclick = () => toggleFeature("grenadeTimer", btnGrenade);
        btnHealth.onclick = () => toggleFeature("healthIndicator", btnHealth);
        btnAdrenaline.onclick = () => toggleFeature("adrenalineIndicator", btnAdrenaline);
        btnLobbyBG.onclick = () => toggleFeature("lobbyBackground", btnLobbyBG);
    }

    // Modify game functions: drawing ESP, aimbot, spinbot, grenade radius, etc.
    function modifyGame() {
        let canvas = document.querySelector("canvas");
        if (!canvas) return;
        let ctx = canvas.getContext("2d");

        // Draw ESP boxes around enemies
        function drawESP(x, y, width, height, health) {
            ctx.strokeStyle = health > 50 ? "green" : "red";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
        }

        // Draw grenade explosion radius (red circle)
        function drawGrenadeRadius(grenade) {
            ctx.beginPath();
            let radius = grenade.radius || 50; // default radius if not defined
            ctx.arc(grenade.x, grenade.y, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Aimbot functionality
        function aimbot() {
            if (!settings.aimbot) return;
            if (typeof findEnemies !== "function" || typeof aimAt !== "function") return;
            let enemies = findEnemies();
            if (enemies.length > 0) {
                let closest = enemies.reduce((a, b) => (a.dist < b.dist ? a : b));
                aimAt(closest.x, closest.y);
            }
        }

        // Spinbot functionality: rotates player continuously
        function spinbot() {
            if (!settings.spinbot) return;
            if (typeof player !== "undefined" && typeof player.angle === "number") {
                player.angle += 5; // adjust rotation speed as needed
                if (player.angle >= 360) player.angle -= 360;
            }
        }

        // Main loop to update game modifications
        function loop() {
            // Draw ESP if enabled
            if (settings.esp && typeof findEnemies === "function") {
                let enemies = findEnemies();
                enemies.forEach(enemy => drawESP(enemy.x, enemy.y, 30, 30, enemy.health));
            }
            // Draw grenade explosion radius if enabled and function available
            if (settings.explosionRadius && typeof getGrenades === "function") {
                let grenades = getGrenades();
                grenades.forEach(grenade => drawGrenadeRadius(grenade));
            }
            // Update aimbot and spinbot
            aimbot();
            spinbot();
            requestAnimationFrame(loop);
        }
        loop();
    }

    // Enhanced anti-detection measures
    function antiDetection() {
        // Remove our script tag from DOM to reduce detection risk
        if (document.currentScript) {
            document.currentScript.remove();
        }
        // Override certain functions to prevent detection of cheat activity
        let originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (url.includes("cheat_detect")) return new Promise(() => {});
            return originalFetch(url, options);
        };
        // Optionally, you can hide console logs
        console.log = function() {};
    }

    // Add a dynamic kill counter that appears only when the game is active and resets after game ends
    function addKillCounter() {
        let counter = document.createElement("div");
        counter.id = "killCounter";
        counter.style.position = "fixed";
        counter.style.top = "10px";
        counter.style.left = "10px";
        counter.style.fontSize = "18px";
        counter.style.fontWeight = "bold";
        counter.style.color = "white";
        counter.style.background = "rgba(0, 0, 0, 0.7)";
        counter.style.padding = "5px 10px";
        counter.style.borderRadius = "5px";
        counter.style.boxShadow = "0px 0px 10px rgba(255, 0, 0, 0.7)";
        counter.style.display = "none"; // Hidden by default
        document.body.appendChild(counter);

        let currentKills = 0;
        // Update kill counter every second
        setInterval(() => {
            // Check if game is active by testing if getPlayerKills is defined
            if (typeof getPlayerKills === "function") {
                let kills = getPlayerKills();
                // Show kill counter when game is active
                if (counter.style.display === "none") {
                    counter.style.display = "block";
                }
                // Update only if kills have changed
                if (kills !== currentKills) {
                    currentKills = kills;
                    counter.innerText = "Kills: " + kills;
                }
            } else {
                // Game is not active; hide counter and reset kills
                if (counter.style.display !== "none") {
                    counter.style.display = "none";
                    currentKills = 0;
                }
            }
        }, 1000);
    }

    // Wait for the game canvas to load before modifying game
    function waitForGame() {
        let checkInterval = setInterval(() => {
            let canvas = document.querySelector("canvas");
            if (canvas) {
                clearInterval(checkInterval);
                modifyGame();
            }
        }, 500);
    }

    // Initialize everything on window load
    window.addEventListener("load", () => {
        createGUI();
        waitForGame();
        antiDetection();
        addKillCounter();
    });
})();
