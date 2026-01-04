// ==UserScript==
// @name         Cryzen.io Auto BH
// @namespace    ViolentMonkey
// @version      1.6
// @description  Auto BH pod spację, aktywowany przez funkcję enableUP()
// @author       Diwi
// @match        *://cryzen.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let autoBunnyHopInterval = null;
    let scope = null;
    const newScopeURL = ""; // Jeśli chcesz dodać celownik

    function enableUP() {
        console.log("Auto Bunny Hop activé !");
        document.addEventListener('keydown', (event) => {
            if (event.key === ' ' && autoBunnyHopInterval === null) {
                autoBunnyHopInterval = setInterval(() => {
                    const spaceEvent = new KeyboardEvent('keydown', {
                        key: ' ',
                        code: 'Space',
                        keyCode: 32,
                        which: 32,
                        bubbles: true,
                        cancelable: true
                    });

                    Object.defineProperty(spaceEvent, 'keyCode', { get: () => 32 });
                    Object.defineProperty(spaceEvent, 'which', { get: () => 32 });

                    document.dispatchEvent(spaceEvent);
                }, 30); // Szybkość bhopa
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === ' ') {
                clearInterval(autoBunnyHopInterval);
                autoBunnyHopInterval = null;
            }
        });
    }

    function disableUP() {
        console.log("Auto Bunny Hop désactivé !");
        clearInterval(autoBunnyHopInterval);
        autoBunnyHopInterval = null;
    }

    function createScopeOverlay() {
        scope = document.createElement("img");
        scope.src = newScopeURL;
        scope.id = "custom-sniper-scope";
        scope.style.position = "fixed";
        scope.style.top = "50%";
        scope.style.left = "50%";
        scope.style.transform = "translate(-50%, -50%)";
        scope.style.pointerEvents = "none";
        scope.style.maxWidth = "100vw";
        scope.style.maxHeight = "100vh";
        scope.style.zIndex = "99999";
        document.body.appendChild(scope);
    }

    function enableCROSS() {
        if (!scope) {
            createScopeOverlay();
        } else {
            scope.style.display = "block";
        }
    }

    function disableCROSS() {
        if (scope) {
            scope.style.display = "none";
        }
    }

    // Dodaj od razu info w konsoli i na ekranie
    console.log("Success: Injected");
    const injectedDiv = document.createElement('div');
    injectedDiv.textContent = 'Injected';
    injectedDiv.style.position = 'fixed';
    injectedDiv.style.top = '10px';
    injectedDiv.style.right = '10px';
    injectedDiv.style.background = 'rgba(0, 0, 0, 0.6)';
    injectedDiv.style.color = 'lime';
    injectedDiv.style.padding = '4px 10px';
    injectedDiv.style.fontFamily = 'monospace';
    injectedDiv.style.fontSize = '14px';
    injectedDiv.style.borderRadius = '6px';
    injectedDiv.style.zIndex = '9999';
    document.body.appendChild(injectedDiv);

    // Jeśli chcesz aktywować auto z automatu:
    // enableUP();

    // Lub z poziomu menu/konsole:
    window.enableUP = enableUP;
    window.disableUP = disableUP;
})();
