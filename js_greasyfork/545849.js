// ==UserScript==
// @name         Bloxd.io Police Mod Prototype
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Police car overlay, siren, metal bars & doors (client-side effects only) for Bloxd.io
// @author       dphangse0184-cmyk
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545849/Bloxdio%20Police%20Mod%20Prototype.user.js
// @updateURL https://update.greasyfork.org/scripts/545849/Bloxdio%20Police%20Mod%20Prototype.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== POLICE CAR OVERLAY =====
    const car = document.createElement('div');
    car.style.position = 'fixed';
    car.style.left = '35vw';
    car.style.top = '65vh';
    car.style.width = '240px';
    car.style.height = '100px';
    car.style.background = 'linear-gradient(90deg, #222 60px, #1e90ff 120px, #fff 150px)';
    car.style.border = '5px solid #000';
    car.style.borderRadius = '34px 34px 34px 34px/34px 34px 34px 34px';
    car.style.zIndex = '9999';
    car.style.transition = 'box-shadow 0.2s';
    car.style.boxSizing = 'border-box';
    car.style.userSelect = 'none';
    car.style.display = 'block';

    // Metal bars (front, sides)
    const barFront = document.createElement('div');
    barFront.style.position = 'absolute';
    barFront.style.top = '10px';
    barFront.style.left = '75px';
    barFront.style.width = '90px';
    barFront.style.height = '8px';
    barFront.style.background = '#AAA';
    barFront.style.borderRadius = '4px';
    car.appendChild(barFront);

    const barSideLeft = document.createElement('div');
    barSideLeft.style.position = 'absolute';
    barSideLeft.style.top = '75px';
    barSideLeft.style.left = '12px';
    barSideLeft.style.width = '20px';
    barSideLeft.style.height = '18px';
    barSideLeft.style.background = '#AAA';
    barSideLeft.style.borderRadius = '3px';
    car.appendChild(barSideLeft);

    const barSideRight = document.createElement('div');
    barSideRight.style.position = 'absolute';
    barSideRight.style.top = '75px';
    barSideRight.style.right = '12px';
    barSideRight.style.width = '20px';
    barSideRight.style.height = '18px';
    barSideRight.style.background = '#AAA';
    barSideRight.style.borderRadius = '3px';
    car.appendChild(barSideRight);

    // Metal bar doors (locked/unlocked)
    const doorLeft = document.createElement('div');
    doorLeft.style.position = 'absolute';
    doorLeft.style.top = '45px';
    doorLeft.style.left = '25px';
    doorLeft.style.width = '30px';
    doorLeft.style.height = '40px';
    doorLeft.style.background = 'rgba(120,120,120,0.5)';
    doorLeft.style.border = '3px solid #555';
    doorLeft.style.borderRadius = '8px';
    doorLeft.style.display = 'block';
    car.appendChild(doorLeft);

    const doorRight = document.createElement('div');
    doorRight.style.position = 'absolute';
    doorRight.style.top = '45px';
    doorRight.style.right = '25px';
    doorRight.style.width = '30px';
    doorRight.style.height = '40px';
    doorRight.style.background = 'rgba(120,120,120,0.5)';
    doorRight.style.border = '3px solid #555';
    doorRight.style.borderRadius = '8px';
    doorRight.style.display = 'block';
    car.appendChild(doorRight);

    // Car label
    const carLabel = document.createElement('div');
    carLabel.textContent = '🚓 POLICE CAR';
    carLabel.style.position = 'absolute';
    carLabel.style.bottom = '8px';
    carLabel.style.left = '70px';
    carLabel.style.fontWeight = 'bold';
    carLabel.style.fontFamily = 'Arial, sans-serif';
    carLabel.style.color = '#fff';
    carLabel.style.fontSize = '20px';
    carLabel.style.textShadow = '2px 2px 6px #000';
    car.appendChild(carLabel);

    document.body.appendChild(car);

    // ===== CAR CONTROLS (WASD) =====
    let x = window.innerWidth * 0.35, y = window.innerHeight * 0.65;
    let speed = 0, angle = 0, rot = 0;
    let keys = {};

    function updateCar() {
        // Movement
        if (keys['w']) speed = Math.min(speed + 0.12, 6.5);
        else if (keys['s']) speed = Math.max(speed - 0.12, -3.5);
        else speed *= 0.96;

        if (keys['a']) rot = Math.max(rot - 0.08, -0.12);
        else if (keys['d']) rot = Math.min(rot + 0.08, 0.12);
        else rot *= 0.8;

        angle += rot;
        x += speed * Math.cos(angle);
        y += speed * Math.sin(angle);

        // Keep car on screen
        x = Math.max(0, Math.min(window.innerWidth - 240, x));
        y = Math.max(0, Math.min(window.innerHeight - 100, y));

        car.style.left = `${x}px`;
        car.style.top = `${y}px`;
        car.style.transform = `rotate(${angle}rad)`;

        requestAnimationFrame(updateCar);
    }
    updateCar();

    // ===== SIREN =====
    let sirenOn = false;
    let sirenInterval = null;
    function toggleSiren() {
        sirenOn = !sirenOn;
        if (sirenOn) {
            car.style.boxShadow = '0 0 50px 15px #1e90ff';
            sirenInterval = setInterval(() => {
                car.style.boxShadow = car.style.boxShadow === '0 0 50px 15px #1e90ff'
                    ? '0 0 50px 15px #ff0000'
                    : '0 0 50px 15px #1e90ff';
            }, 300);
            // Siren sound (simple beep, can be replaced with actual sound)
            const beep = new Audio("https://cdn.pixabay.com/audio/2022/10/16/audio_125b3b5b66.mp3");
            beep.loop = true;
            beep.volume = 0.3;
            beep.play();
            car._sirenSound = beep;
        } else {
            car.style.boxShadow = '';
            clearInterval(sirenInterval);
            if (car._sirenSound) {
                car._sirenSound.pause();
                car._sirenSound.currentTime = 0;
            }
        }
    }

    // ===== METAL BAR DOORS LOCK/UNLOCK =====
    let doorsLocked = true;
    function toggleDoors() {
        doorsLocked = !doorsLocked;
        if (doorsLocked) {
            doorLeft.style.background = 'rgba(120,120,120,0.5)';
            doorRight.style.background = 'rgba(120,120,120,0.5)';
            doorLeft.style.borderColor = '#555';
            doorRight.style.borderColor = '#555';
            carLabel.textContent = '🚓 POLICE CAR [LOCKED]';
        } else {
            doorLeft.style.background = 'rgba(180,255,180,0.2)';
            doorRight.style.background = 'rgba(180,255,180,0.2)';
            doorLeft.style.borderColor = '#9f9';
            doorRight.style.borderColor = '#9f9';
            carLabel.textContent = '🚓 POLICE CAR [UNLOCKED]';
        }
    }

    // ===== KEY CONTROLS =====
    window.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;
        // Toggle siren: F key
        if (e.key === 'f' || e.key === 'F') toggleSiren();
        // Toggle metal bar doors: L key
        if (e.key === 'l' || e.key === 'L') toggleDoors();
    });
    window.addEventListener('keyup', e => {
        keys[e.key.toLowerCase()] = false;
    });

    // ===== HELP / INSTRUCTIONS =====
    setTimeout(() => {
        alert(
            "Bloxd.io Police Mod (Prototype)\n\n" +
            "Controls:\n" +
            "- WASD: Drive police car overlay\n" +
            "- F: Toggle siren (visual, with sound)\n" +
            "- L: Lock/Unlock metal bar doors\n\n" +
            "Client-side only! Other players do not see your car or effects."
        );
    }, 1000);

})();