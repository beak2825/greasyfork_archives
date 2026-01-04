// ==UserScript==
// @name         AutoScroll Mobile
// @namespace    https://greasyfork.org/users/1429467
// @description  AutoScroll avec boutons tactiles pour mobiles et tablettes
// @include      http*
// @version      1.3
// @author       Lakfu sama
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525417/AutoScroll%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/525417/AutoScroll%20Mobile.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scrolling = false;
    let speed = 50;
    let scrollInterval;

    function startScrolling() {
        if (!scrolling) {
            scrolling = true;
            scrollInterval = setInterval(() => {
                window.scrollBy(0, 5);
            }, speed);
            updateButtonState();
        }
    }

    function stopScrolling() {
        scrolling = false;
        clearInterval(scrollInterval);
        updateButtonState();
    }

    function toggleScrolling() {
        scrolling ? stopScrolling() : startScrolling();
    }

    function increaseSpeed() {
        if (speed > 10) {
            speed -= 10;
            restartScrolling();
        }
    }

    function decreaseSpeed() {
        speed += 10;
        restartScrolling();
    }

    function restartScrolling() {
        if (scrolling) {
            stopScrolling();
            startScrolling();
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function scrollToBottom() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    function updateButtonState() {
        let button = document.getElementById('scroll-toggle');
        if (scrolling) {
            button.textContent = '⏸️ Stop';
            button.style.backgroundColor = '#ff5555';
        } else {
            button.textContent = '▶️ Start';
            button.style.backgroundColor = '#4CAF50';
        }
    }

    // Supprimer les anciens boutons pour éviter les doublons
    function removeExistingButtons() {
        document.querySelectorAll('.scroll-btn').forEach(btn => btn.remove());
    }

    // Création des boutons tactiles
    function createButton(id, text, onClick, bgColor, position) {
        let button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.onclick = onClick;
        button.style.position = 'fixed';
        button.style.bottom = '5px'; // Position basse
        button.style.right = position + 'vw'; // Position horizontale dynamique
        button.style.width = '50px'; // Taille adaptée au tactile
        button.style.height = '50px';
        button.style.fontSize = '16px';
        button.style.border = 'none';
        button.style.borderRadius = '10px';
        button.style.backgroundColor = bgColor;
        button.style.color = 'white';
        button.style.zIndex = '10000';
        button.className = 'scroll-btn';
        document.body.appendChild(button);
    }

    // Supprimer les boutons existants avant de les recréer
    removeExistingButtons();

    // Création des boutons avec un espacement uniforme
    let buttons = [
        { id: 'scroll-toggle', text: '▶️ Start', action: toggleScrolling, color: '#4CAF50', pos: 2 },
        { id: 'scroll-up', text: '⬆️', action: scrollToTop, color: '#2196F3', pos: 12 },
        { id: 'scroll-down', text: '⬇️', action: scrollToBottom, color: '#2196F3', pos: 22 },
        { id: 'speed-up', text: '⏩+', action: increaseSpeed, color: '#FF9800', pos: 32 },
        { id: 'speed-down', text: '⏪-', action: decreaseSpeed, color: '#FF9800', pos: 42 }
    ];

    buttons.forEach(btn => {
        createButton(btn.id, btn.text, btn.action, btn.color, btn.pos);
    });

})();
