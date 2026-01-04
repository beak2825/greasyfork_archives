// ==UserScript==
// @name         Drawaria Rain Effect And Sad Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds rain effect and sad mod in Drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524309/Drawaria%20Rain%20Effect%20And%20Sad%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/524309/Drawaria%20Rain%20Effect%20And%20Sad%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear el contenedor de la lluvia
    const rainContainer = document.createElement('div');
    rainContainer.style.position = 'fixed';
    rainContainer.style.top = '0';
    rainContainer.style.left = '0';
    rainContainer.style.width = '100%';
    rainContainer.style.height = '100%';
    rainContainer.style.pointerEvents = 'none';
    rainContainer.style.zIndex = '9999';
    rainContainer.style.overflow = 'hidden';
    document.body.appendChild(rainContainer);

    // Crear más gotas de lluvia
    for (let i = 0; i < 200; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.bottom = `${Math.random() * 100}%`;
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.width = '2px';
        drop.style.height = '15px';
        drop.style.backgroundColor = 'rgba(174, 194, 224, 0.7)';
        drop.style.borderRadius = '50%';
        drop.style.animation = 'fall 1.5s infinite linear';
        drop.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(drop);
    }

    // Añadir estilo para la animación de caída
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fall {
            to {
                transform: translateY(100vh);
            }
        }
        @keyframes moveRight {
            to {
                transform: translateX(100vw);
            }
        }
        .shadow {
            box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.5);
            animation: moveRight 10s infinite linear;
        }
    `;
    document.head.appendChild(style);

    // Oscurecer la pantalla
    const darkOverlay = document.createElement('div');
    darkOverlay.style.position = 'fixed';
    darkOverlay.style.top = '0';
    darkOverlay.style.left = '0';
    darkOverlay.style.width = '100%';
    darkOverlay.style.height = '100%';
    darkOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    darkOverlay.style.pointerEvents = 'none';
    darkOverlay.style.zIndex = '9998';
    document.body.appendChild(darkOverlay);


})();
