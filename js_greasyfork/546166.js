// ==UserScript==
// @name         Bloxd.io Pirate Mod (with Cannons)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pirate ships, flags, hats, custom skins and cannons for Bloxd.io (client-side only)
// @author       dphangse0184-cmyk
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546166/Bloxdio%20Pirate%20Mod%20%28with%20Cannons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546166/Bloxdio%20Pirate%20Mod%20%28with%20Cannons%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === PIRATE SHIP ===
    const ship = document.createElement('div');
    ship.style.position = 'fixed';
    ship.style.left = '35vw';
    ship.style.top = '65vh';
    ship.style.width = '320px';
    ship.style.height = '120px';
    ship.style.background = 'linear-gradient(90deg, #8b5a2b 90px, #deb887 200px, #8b5a2b 320px)';
    ship.style.borderRadius = '50px 50px 60px 60px/70px 70px 100px 100px';
    ship.style.border = '5px solid #222';
    ship.style.zIndex = '9999';
    ship.style.boxSizing = 'border-box';
    ship.style.userSelect = 'none';

    // Pirate flag
    const flag = document.createElement('div');
    flag.style.position = 'absolute';
    flag.style.top = '-35px';
    flag.style.left = '250px';
    flag.style.width = '45px';
    flag.style.height = '30px';
    flag.style.background = '#000';
    flag.style.border = '2px solid #fff';
    flag.style.borderRadius = '3px';
    flag.style.display = 'block';
    flag.style.zIndex = '10000';
    flag.innerHTML = '<span style="color:white;font-size:22px;position:absolute;left:7px;top:2px;">☠️</span>';
    ship.appendChild(flag);

    // Ship label
    const shipLabel = document.createElement('div');
    shipLabel.textContent = '🏴‍☠️ PIRATE SHIP';
    shipLabel.style.position = 'absolute';
    shipLabel.style.bottom = '8px';
    shipLabel.style.left = '110px';
    shipLabel.style.fontWeight = 'bold';
    shipLabel.style.fontFamily = 'Arial, sans-serif';
    shipLabel.style.color = '#fff';
    shipLabel.style.fontSize = '22px';
    shipLabel.style.textShadow = '2px 2px 8px #000';
    ship.appendChild(shipLabel);

    document.body.appendChild(ship);

    // === SHIP FLOATS ON WATER (simulated) ===
    function isOverWater(x, y) {
        // Simulate: only allow movement if y > 60% of screen height
        return y > window.innerHeight * 0.6;
    }

    // === SHIP CONTROLS (WASD) ===
    let x = window.innerWidth * 0.35, y = window.innerHeight * 0.65;
    let speed = 0, angle = 0, rot = 0;
    let keys = {};

    function updateShip() {
        if (isOverWater(x, y)) {
            if (keys['w']) speed = Math.min(speed + 0.09, 4.5);
            else if (keys['s']) speed = Math.max(speed - 0.12, -2.5);
            else speed *= 0.96;

            if (keys['a']) rot = Math.max(rot - 0.08, -0.10);
            else if (keys['d']) rot = Math.min(rot + 0.08, 0.10);
            else rot *= 0.8;

            angle += rot;
            x += speed * Math.cos(angle);
            y += speed * Math.sin(angle);

            // Keep ship on screen
            x = Math.max(0, Math.min(window.innerWidth - 320, x));
            y = Math.max(0, Math.min(window.innerHeight - 120, y));
        }

        ship.style.left = `${x}px`;
        ship.style.top = `${y}px`;
        ship.style.transform = `rotate(${angle}rad)`;

        requestAnimationFrame(updateShip);
    }
    updateShip();

    // === PIRATE BICORNE HAT OVERLAY ===
    const hat = document.createElement('div');
    hat.style.position = 'fixed';
    hat.style.left = '49vw';
    hat.style.top = '13vh';
    hat.style.width = '80px';
    hat.style.height = '50px';
    hat.style.background = 'radial-gradient(ellipse at center, #222 70%, #ffd700 100%)';
    hat.style.borderRadius = '40px 40px 90px 90px/35px 35px 80px 80px';
    hat.style.border = '4px solid #ffd700';
    hat.style.zIndex = '9999';
    hat.style.display = 'none';
    hat.innerHTML = '<div style="position:absolute;left:32px;top:12px;font-size:26px;z-index:2;">☠️</div>';
    document.body.appendChild(hat);

    // === PIRATE CUSTOM SKIN OVERLAY ===
    const skin = document.createElement('div');
    skin.style.position = 'fixed';
    skin.style.left = '48vw';
    skin.style.top = '20vh';
    skin.style.width = '100px';
    skin.style.height = '170px';
    skin.style.background = 'linear-gradient(90deg, #deb887 60px, #fff 100px, #deb887 100px)';
    skin.style.border = '4px solid #222';
    skin.style.borderRadius = '23px 23px 23px 23px/38px 38px 38px 38px';
    skin.style.zIndex = '9998';
    skin.style.display = 'none';
    skin.innerHTML = '<div style="position:absolute;top:20px;left:28px;color:#222;font-size:34px;font-family:serif;">🦜</div>';
    document.body.appendChild(skin);

    // === PHYSICAL UNANCHORED CANNON ===
    const cannon = document.createElement('div');
    cannon.style.position = 'fixed';
    cannon.style.left = '68vw';
    cannon.style.top = '72vh';
    cannon.style.width = '75px';
    cannon.style.height = '40px';
    cannon.style.background = '#222';
    cannon.style.border = '3px solid #444';
    cannon.style.borderRadius = '15px 15px 25px 25px/15px 15px 40px 40px';
    cannon.style.zIndex = '9999';

    // Cannon barrel
    const barrel = document.createElement('div');
    barrel.style.position = 'absolute';
    barrel.style.left = '49px';
    barrel.style.top = '9px';
    barrel.style.width = '24px';
    barrel.style.height = '11px';
    barrel.style.background = '#555';
    barrel.style.borderRadius = '6px';
    cannon.appendChild(barrel);

    // Cannon label
    const cannonLabel = document.createElement('div');
    cannonLabel.textContent = '🧨 CANNON';
    cannonLabel.style.position = 'absolute';
    cannonLabel.style.bottom = '1px';
    cannonLabel.style.left = '7px';
    cannonLabel.style.fontWeight = 'bold';
    cannonLabel.style.fontFamily = 'Arial, sans-serif';
    cannonLabel.style.color = '#fff';
    cannonLabel.style.fontSize = '15px';
    cannonLabel.style.textShadow = '1px 1px 6px #000';
    cannon.appendChild(cannonLabel);

    document.body.appendChild(cannon);

    // === CANNON CONTROLS (Arrow keys + Space to shoot) ===
    let cx = window.innerWidth * 0.68, cy = window.innerHeight * 0.72, ca = 0;
    let cSpeed = 0, cRot = 0, cannonKeys = {};
    let cannonballs = [];

    function updateCannon() {
        // Move
        if (cannonKeys['arrowup']) cSpeed = Math.min(cSpeed + 0.12, 5.5);
        else if (cannonKeys['arrowdown']) cSpeed = Math.max(cSpeed - 0.12, -2.5);
        else cSpeed *= 0.95;

        if (cannonKeys['arrowleft']) cRot = Math.max(cRot - 0.06, -0.14);
        else if (cannonKeys['arrowright']) cRot = Math.min(cRot + 0.06, 0.14);
        else cRot *= 0.85;

        ca += cRot;
        cx += cSpeed * Math.cos(ca);
        cy += cSpeed * Math.sin(ca);

        // Keep cannon on screen
        cx = Math.max(0, Math.min(window.innerWidth - 75, cx));
        cy = Math.max(0, Math.min(window.innerHeight - 40, cy));

        cannon.style.left = `${cx}px`;
        cannon.style.top = `${cy}px`;
        cannon.style.transform = `rotate(${ca}rad)`;

        // Update cannonballs
        for (let i = cannonballs.length - 1; i >= 0; i--) {
            let ball = cannonballs[i];
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.elem.style.left = `${ball.x}px`;
            ball.elem.style.top = `${ball.y}px`;

            // Remove if off-screen
            if (
                ball.x < -30 ||
                ball.x > window.innerWidth + 30 ||
                ball.y < -30 ||
                ball.y > window.innerHeight + 30
            ) {
                ball.elem.remove();
                cannonballs.splice(i, 1);
            }
        }

        requestAnimationFrame(updateCannon);
    }
    updateCannon();

    // === SHOOT CANNONBALL ===
    function shootCannon() {
        // Cannonball
        const ball = document.createElement('div');
        ball.style.position = 'fixed';
        ball.style.width = '18px';
        ball.style.height = '18px';
        ball.style.background = '#444';
        ball.style.border = '3px solid #000';
        ball.style.borderRadius = '50%';
        ball.style.left = `${cx + 55 * Math.cos(ca)}px`;
        ball.style.top = `${cy + 55 * Math.sin(ca)}px`;
        ball.style.zIndex = '12000';
        ball.style.boxShadow = '0 0 20px 5px #222';
        document.body.appendChild(ball);

        let vx = 9 * Math.cos(ca), vy = 9 * Math.sin(ca);
        cannonballs.push({elem: ball, x: cx + 55 * Math.cos(ca), y: cy + 55 * Math.sin(ca), vx, vy});
    }

    // === KEY CONTROLS ===
    window.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;
        cannonKeys[e.key.toLowerCase()] = true;
        // Toggle bicorne hat: H key
        if (e.key === 'h' || e.key === 'H') hat.style.display = (hat.style.display === 'none') ? 'block' : 'none';
        // Toggle pirate skin: P key
        if (e.key === 'p' || e.key === 'P') skin.style.display = (skin.style.display === 'none') ? 'block' : 'none';
        // Shoot cannon: Space key
        if (e.code === 'Space') shootCannon();
    });
    window.addEventListener('keyup', e => {
        keys[e.key.toLowerCase()] = false;
        cannonKeys[e.key.toLowerCase()] = false;
    });

    // === HELP / INSTRUCTIONS ===
    setTimeout(() => {
        alert(
            "Bloxd.io Pirate Mod\n\n" +
            "Ship Controls:\n" +
            "- WASD: Sail pirate ship overlay (floats only in lower screen = 'water')\n" +
            "Cannon Controls:\n" +
            "- Arrow Keys: Move cannon overlay\n" +
            "- Space: Shoot cannonball\n" +
            "Other:\n" +
            "- H: Toggle bicorne pirate hat overlay\n" +
            "- P: Toggle pirate skin overlay\n" +
            "Client-side only! Other players do not see your overlays."
        );
    }, 800);

})();