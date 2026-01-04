// ==UserScript==
// @name        rͭaͪdͤiant ͫᵒᵈ
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description Perfect Anti-Insta, Auto-Heal Instantly on Damage, Hat Macros (F: Tank, G: Soldier), Quad Spike (T), Quad Trap (Y), Enemy Trap Indicator, Red/Green Push Alignment Line, Auto-Trap Defense (Blocks Spikes), Custom Background & Ad Removal
// @author      II
// @match       *://moomoo.io/*
// @grant       GM_addStyle
// @license     ALL RIGHTS RESERVED
// @downloadURL https://update.greasyfork.org/scripts/525230/r%CD%ADa%CD%AAd%CD%A4iant%20%CD%AB%E1%B5%92%E1%B5%88.user.js
// @updateURL https://update.greasyfork.org/scripts/525230/r%CD%ADa%CD%AAd%CD%A4iant%20%CD%AB%E1%B5%92%E1%B5%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🔥 rͭaͪdͤiant ͫᵒᵈ Mod Loaded!");

    // Set custom homepage background
    document.body.style.background = "url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Lens_flare_starlight.jpg/1024px-Lens_flare_starlight.jpg') no-repeat center center fixed";
    document.body.style.backgroundSize = "cover";

    // Remove ads function
    function removeAds() {
        let adSelectors = [
            "#adContainer", 
            ".adsbygoogle", 
            ".ad-banner",   
            "[id^='ad_']",  
            "[class*='ad-']"
        ];
        adSelectors.forEach(selector => {
            let ads = document.querySelectorAll(selector);
            ads.forEach(ad => ad.remove());
        });
    }

    // Run ad removal every 2 seconds (in case new ads load dynamically)
    setInterval(removeAds, 2000);

    // Keybinds
    const KEY_TANK_GEAR = 'F';
    const KEY_SOLDIER_GEAR = 'G';
    const KEY_QUAD_SPIKE = 'T';
    const KEY_QUAD_TRAP = 'Y';

    const AUTO_HEAL_THRESHOLD = 60;
    let autoHealEnabled = true;
    let antiTrapEnabled = true;

    let lastTrapTime = 0;
    const TRAP_DELAY = 2000;

    let player = { x: 0, y: 0 };
    let enemies = {};
    let spikes = [];

    // Create a canvas for enemy trap indicator
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    let ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Intercept WebSocket messages
    const oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        try {
            let msg = new Uint8Array(data);

            // Auto-Heal & Anti-Insta
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 1) {
                let health = msg[3];
                if (autoHealEnabled && health < AUTO_HEAL_THRESHOLD) {
                    console.log("⚕️ Auto Healing...");
                    oldSend.call(this, new Uint8Array([255, 3, 0]));
                }
                if (health < 30) {
                    console.log("🛡️ Auto-Switching to Soldier Gear!");
                    selectHat(15);
                }
            }

            // Anti-Trap Mode
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 3 && antiTrapEnabled) {
                let trapType = msg[2]; 
                if (trapType === 6) { 
                    let now = Date.now();
                    if (now - lastTrapTime > TRAP_DELAY) {
                        console.log("🚨 Anti-Trap Mode: Placing traps behind!");
                        placeTrapBehind();
                        lastTrapTime = now;
                    }
                }
            }

            // Enemy Trap Indicator
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 3) {
                let enemyID = msg[2];
                let trapX = msg[3];
                let trapY = msg[4];

                if (enemies[enemyID]) {
                    let enemyPos = enemies[enemyID];
                    let closestSpike = getNearestSpike(enemyPos.x, enemyPos.y);
                    if (closestSpike) {
                        drawLethalLine(player.x, player.y, enemyPos.x, enemyPos.y, closestSpike.x, closestSpike.y);
                    }
                }
            }

        } catch (error) {
            console.error("Error processing WebSocket data:", error);
        }
        return oldSend.apply(this, arguments);
    };

    // Key events
    document.addEventListener("keydown", function(event) {
        let key = event.key.toUpperCase();

        if (key === KEY_TANK_GEAR) {
            console.log("💥 Switching to Tank Gear...");
            selectHat(7);
        }
        if (key === KEY_SOLDIER_GEAR) {
            console.log("🛡️ Switching to Soldier Gear...");
            selectHat(15);
        }
        if (key === KEY_QUAD_SPIKE) {
            console.log("💥 Placing Quad Spikes...");
            placeQuadSpikes();
        }
        if (key === KEY_QUAD_TRAP) {
            console.log("🚨 Placing Quad Traps...");
            placeQuadTraps();
        }
    });

    // Draw Enemy Trap Indicator
    function drawLethalLine(px, py, ex, ey, sx, sy) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(ex, ey);
        ctx.lineTo(sx, sy);

        let isAligned = Math.abs(px - sx) < 10 || Math.abs(py - sy) < 10;
        ctx.strokeStyle = isAligned ? "green" : "red";
        ctx.lineWidth = 3;
        ctx.stroke();

        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 3000);
    }

    // Place 2 traps behind
    function placeTrapBehind() {
        for (let i = 0; i < 2; i++) {
            window.gameSocket.send(new Uint8Array([255, 3, 6]));
        }
    }

    // Place 4 spikes
    function placeQuadSpikes() {
        for (let i = 0; i < 4; i++) {
            window.gameSocket.send(new Uint8Array([255, 3, 0]));
        }
    }

    // Place 4 traps
    function placeQuadTraps() {
        for (let i = 0; i < 4; i++) {
            window.gameSocket.send(new Uint8Array([255, 3, 6]));
        }
    }

    // Select a hat
    function selectHat(hatID) {
        window.gameSocket.send(new Uint8Array([255, 6, hatID]));
    }

})();
