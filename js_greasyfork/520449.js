// ==UserScript==
// @name         Minimap Rescaler with Position and Size UI (Memory-Based)
// @namespace    http://tampermonkey.net/
// @version      2024-12-11
// @description  Change the position and size of the minimap in Diep.io by manipulating memory
// @author       You
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520449/Minimap%20Rescaler%20with%20Position%20and%20Size%20UI%20%28Memory-Based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520449/Minimap%20Rescaler%20with%20Position%20and%20Size%20UI%20%28Memory-Based%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const handler = {apply(r,o,args){Error.stackTraceLimit=0;return r.apply(o,args)}};Object.freeze = new Proxy(Object.freeze, handler)

    window.HEAPF32 = undefined;

    const win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;
    win.Object.defineProperty(win.Object.prototype, "HEAPF32", {
        get: function() {
            return undefined;
        },
        set: function(to) {
            if(!to || !this.HEAPU32) return;
            delete win.Object.prototype.HEAPF32;
            window.Module = this;
            window.Module.HEAPF32 = to;
            window.HEAPF32 = to;

            console.log("HEAPF32 found");
        },
        configurable: true,
        enumerable: true
    });

    // Fonction d'ajout de l'interface utilisateur pour déplacer et redimensionner la minimap
    function createMinimapUI() {
        // Créer un panneau d'interface utilisateur
        const uiPanel = document.createElement('div');
        uiPanel.style.position = 'absolute'; // Positionnement absolu
        uiPanel.style.right = '150px';
        uiPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        uiPanel.style.color = 'white';
        uiPanel.style.padding = '15px';
        uiPanel.style.borderRadius = '5px';
        uiPanel.style.zIndex = 10000;
        uiPanel.style.width = '250px'; // Taille fixe pour l'interface

        uiPanel.innerHTML = '<strong>Reposition and resize the Minimap</strong><br><br>';

        // Ajouter les sliders pour Position X et Y
        uiPanel.innerHTML += 'Position X: <input type="range" id="minimapX" min="0" max="1600" value="0" style="width: 100%;"><br>';
        uiPanel.innerHTML += 'Position Y: <input type="range" id="minimapY" min="0" max="1600" value="0" style="width: 100%;"><br><br>';

        // Ajouter un seul slider pour la taille de la minimap
        uiPanel.innerHTML += 'Taille: <input type="range" id="minimapSize" min="0" max="1600" value="0" style="width: 100%;"><br><br>';

        // Ajouter le panneau à l'élément 'game-over-screen'
        const gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.appendChild(uiPanel);
        } else {
            console.error('Élément "game-over-screen" non trouvé.');
        }

        // Charger les paramètres depuis le localStorage
        loadSettings();

        // Lier les événements aux sliders pour appliquer les modifications immédiatement
        document.getElementById('minimapX').addEventListener('input', updateMinimap);
        document.getElementById('minimapY').addEventListener('input', updateMinimap);
        document.getElementById('minimapSize').addEventListener('input', updateMinimap);
    }

    // Fonction pour mettre à jour la minimap en temps réel
    function updateMinimap() {
        const x = parseInt(document.getElementById('minimapX').value, 10);
        const y = parseInt(document.getElementById('minimapY').value, 10);
        const size = parseInt(document.getElementById('minimapSize').value, 10);

        // Limiter la taille de la minimap en fonction de la taille de l'écran
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const maxSize = Math.min(screenWidth, screenHeight); // La taille max de la minimap ne doit pas dépasser la taille de l'écran
        const minSize = 0; // Taille minimale

        // Redimensionner la minimap pour ne pas dépasser les bords de l'écran
        const clampedSize = Math.min(Math.max(size, minSize), maxSize);

        // Calculer la nouvelle position pour centrer la minimap par rapport à son nouveau taille
        const newX = Math.max(0, Math.min(x - clampedSize / 2, screenWidth - clampedSize));
        const newY = Math.max(0, Math.min(y - clampedSize / 2, screenHeight - clampedSize));

        // Appliquer les nouvelles valeurs à la minimap
        moveAndResizeMinimap(newX, newY, clampedSize, clampedSize);  // La taille est identique en largeur et hauteur

        // Sauvegarder les paramètres dans le localStorage
        saveSettings(newX, newY, clampedSize);
    }

    // Fonction pour déplacer et redimensionner la minimap dans la mémoire
    function moveAndResizeMinimap(x, y, width, height) {
        if (window.HEAPF32) {
            // Appliquer les nouvelles valeurs aux indices correspondants dans la mémoire WebAssembly
            window.HEAPF32[60903] = x; // Position X
            window.HEAPF32[60904] = y; // Position Y
            window.HEAPF32[60905] = width;  // Taille X
            window.HEAPF32[60906] = height; // Taille Y

            console.log(`Minimap déplacée à X: ${x}, Y: ${y} et redimensionnée à ${width}x${height}`);
        } else {
            console.error('HEAPF32 non trouvé. Impossible de manipuler la mémoire.');
        }
    }

    // Fonction pour sauvegarder les paramètres dans le localStorage
    function saveSettings(x, y, size) {
        localStorage.setItem('minimapX', x);
        localStorage.setItem('minimapY', y);
        localStorage.setItem('minimapSize', size);
    }

    // Fonction pour charger les paramètres depuis le localStorage
    function loadSettings() {
        const savedX = localStorage.getItem('minimapX');
        const savedY = localStorage.getItem('minimapY');
        const savedSize = localStorage.getItem('minimapSize');

        if (savedX !== null && savedY !== null && savedSize !== null) {
            document.getElementById('minimapX').value = savedX;
            document.getElementById('minimapY').value = savedY;
            document.getElementById('minimapSize').value = savedSize;
            // Appliquer les valeurs sauvegardées
            updateMinimap();
        }
    }

    // Créer l'interface une fois que la page est chargée
    window.addEventListener('load', () => {
        // Vérifier si HEAPF32 est accessible
        const waitForHeapF32 = setInterval(() => {
            if (window.HEAPF32) {
                clearInterval(waitForHeapF32);
                createMinimapUI();
                console.log("HEAPF32 trouvé, interface prête.");
            }
        }, 100);
    });

})();
