// ==UserScript==
// @name         Flappy Bird Enhanced Menu 101
// @version      2.0
// @license      Dark Shadow 2025
// @description  Flappy-Bird Utils v 101
// @match        https://flappybird.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1470721
// @downloadURL https://update.greasyfork.org/scripts/536198/Flappy%20Bird%20Enhanced%20Menu%20101.user.js
// @updateURL https://update.greasyfork.org/scripts/536198/Flappy%20Bird%20Enhanced%20Menu%20101.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let immortalityActive = false;
    let menuColor = 'rgba(0, 0, 0, 0.8)';

    const menu = document.createElement('div');
    menu.id = 'flappyBirdMenu';
    menu.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background-color: ${menuColor};
        color: white;
        padding: 12px;
        border-radius: 8px;
        z-index: 10000;
        border: 2px solid white;
        box-shadow: 0 0 0 2px ${menuColor};
        opacity: 0;
        transform: scale(0.95);
        transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
        font-family: Arial, sans-serif;
        font-size: 14px;
        width: 200px;
    `;

    menu.innerHTML = `
        <h2 style="color: white; margin-bottom: 15px; font-size: 18px;">Flappy Bird Mod Menu</h2>
        <button id="toggleImmortalityBtn" class="menuButton">Immortality</button><br>
        <div style="display: flex; align-items: center; margin-top: 8px;">
            <input type="number" id="score-input" min="0" style="width: 60px; margin-right: 5px; background-color: rgba(255, 255, 255, 0.1); color: white; border: 1px solid white; padding: 4px;">
            <button id="set-score-btn" class="menuButton">Set Score</button>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .menuButton {
            margin-bottom: 8px;
            color: white;
            background-color: ${menuColor};
            border: 1px solid white;
            padding: 6px 10px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            font-size: 12px;
            outline: none;
        }
        .menuButton:hover {
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        .menuButton:active {
            transform: scale(0.95);
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(menu);

    function toggleMenu() {
        if (menu.style.opacity === '1') {
            menu.style.opacity = '0';
            menu.style.transform = 'scale(0.95)';
            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
        } else {
            menu.style.display = 'block';
            setTimeout(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'scale(1)';
            }, 50);
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'i') {
            toggleMenu();
        }
    });

    function toggleImmortality() {
        immortalityActive = !immortalityActive;
        const button = document.getElementById('toggleImmortalityBtn');
        button.style.backgroundColor = immortalityActive ? 'rgba(0, 255, 0, 0.5)' : menuColor;
        if (immortalityActive) {
            console.log('Immortality activated');
            if (typeof window.die === 'function') {
                window.originalDie = window.die;
                window.die = function() { console.log('You would have died, but immortality saved you!'); };
            }
        } else {
            console.log('Immortality deactivated');
            if (window.originalDie) {
                window.die = window.originalDie;
            }
        }
    }

    function setScore() {
        const newCount = document.getElementById('score-input').value;

        if (!newCount) {
            alert('Please enter a count value.');
            return;
        }

        // Simulate typing the new count into the console
        const script = document.createElement('script');
        script.textContent = `counter.text = ${newCount};`;
        document.body.appendChild(script);
        document.body.removeChild(script); // Remove the script after execution

        alert(`Count changed to: ${newCount}`);
    }

    document.getElementById('toggleImmortalityBtn').addEventListener('click', toggleImmortality);
    document.getElementById('set-score-btn').addEventListener('click', setScore);
})();
