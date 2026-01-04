// ==UserScript==
// @name         AutoScroll Plus
// @namespace    https://greasyfork.org/users/1429467
// @description  AutoScroll avec contrôle de vitesse et navigation rapide
// @include      http*
// @version      1.0
// @author       Lakfu sama
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525418/AutoScroll%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/525418/AutoScroll%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrolling = false;
    let speed = 50; // Temps en ms entre chaque scroll (plus bas = plus rapide)
    let scrollInterval;

    function startScrolling() {
        if (!scrolling) {
            scrolling = true;
            scrollInterval = setInterval(() => {
                window.scrollBy(0, 5); // Ajuste la valeur pour modifier l'incrément du scroll
            }, speed);
        }
    }

    function stopScrolling() {
        scrolling = false;
        clearInterval(scrollInterval);
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

    // Raccourcis clavier
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 's': // Démarrer/Pause (toggle)
                scrolling ? stopScrolling() : startScrolling();
                break;
            case '+': // Augmenter la vitesse
                increaseSpeed();
                break;
            case '-': // Diminuer la vitesse
                decreaseSpeed();
                break;
            case 't': // Aller en haut
                scrollToTop();
                break;
            case 'b': // Aller en bas
                scrollToBottom();
                break;
        }
    });

    console.log("AutoScroll Plus chargé :\n[s] Démarrer/Pause | [+] Augmenter vitesse | [-] Diminuer vitesse | [t] Haut | [b] Bas");
})();
