// ==UserScript==
// @name         AutoScroll Mobile mod
// @namespace    https://greasyfork.org/users/1429467
// @description  AutoScroll avec boutons tactiles pour mobiles et tablettes
// @include      http*
// @version      1.5
// @author       Lakfu sama
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525661/AutoScroll%20Mobile%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/525661/AutoScroll%20Mobile%20mod.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scrolling = false;
    let speed = 50;
    let scrollInterval;
    let buttonsVisible = true;  // Par défaut, les boutons sont visibles

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
            button.textContent = '⏸️';
            button.style.backgroundColor = '#ff5555';
        } else {
            button.textContent = '▶️';
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
        button.style.right = '5px'; // Position à droite
        button.style.bottom = `${position}vh`; // Position verticale dynamique
        button.style.width = '50px'; // Taille adaptée au tactile
        button.style.height = '50px';
        button.style.fontSize = '16px';
        button.style.border = 'none';
        button.style.borderRadius = '10px';
        button.style.backgroundColor = bgColor;
        button.style.color = 'white';
        button.style.zIndex = '10000';
        button.className = 'scroll-btn';

        // Si les boutons doivent être masqués, on les cache
        if (!buttonsVisible) {
            button.style.display = 'none';
        }

        document.body.appendChild(button);
    }

    // Supprimer les boutons existants avant de les recréer
    removeExistingButtons();

    // Création des boutons avec un espacement uniforme
    let buttons = [
        { id: 'scroll-up', text: '⬆️', action: scrollToTop, color: '#2196F3', pos: 50 },
        { id: 'speed-down', text: '⏪-', action: decreaseSpeed, color: '#FF9800', pos: 20 },
        { id: 'scroll-toggle', text: '▶️ Start', action: toggleScrolling, color: '#4CAF50', pos: 30 },
        { id: 'speed-up', text: '⏩+', action: increaseSpeed, color: '#FF9800', pos: 40 },
        { id: 'scroll-down', text: '⬇️', action: scrollToBottom, color: '#2196F3', pos: 10 }
    ];

    buttons.forEach(btn => {
        createButton(btn.id, btn.text, btn.action, btn.color, btn.pos);
    });

    // Création d'un bouton pour masquer/afficher les autres boutons
    function toggleButtonVisibility() {
        buttonsVisible = !buttonsVisible;
        removeExistingButtons(); // Supprime les anciens boutons
        buttons.forEach(btn => {
            createButton(btn.id, btn.text, btn.action, btn.color, btn.pos);
        });
    }

    // Ajout du bouton pour masquer/afficher
    let visibilityButton = document.createElement('button');
    visibilityButton.textContent = '👁️';
    visibilityButton.onclick = toggleButtonVisibility;
    visibilityButton.style.position = 'fixed';
    visibilityButton.style.right = '5px';
    visibilityButton.style.bottom = '1vh';
    visibilityButton.style.width = '35px';  // Taille réduite
    visibilityButton.style.height = '35px'; // Taille réduite
    visibilityButton.style.fontSize = '18px';  // Taille du texte
    visibilityButton.style.border = 'none';
    visibilityButton.style.borderRadius = '10px';
    visibilityButton.style.backgroundColor = '#ff5555';
    visibilityButton.style.color = 'white';
    visibilityButton.style.zIndex = '10000';

    // Lorsque les boutons sont masqués, on rend '👁️' plus discret
    if (!buttonsVisible) {
        visibilityButton.style.opacity = '0.5';  // Plus discret
    }

    document.body.appendChild(visibilityButton);

})();
