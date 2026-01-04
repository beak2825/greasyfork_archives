// ==UserScript==
// @name         BloxD For Low-End PC's
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Anima o céu, aumenta o FPS e otimiza o desempenho no BloxD.io
// @author       Whoami
// @match        *://bloxd.io/*
// @grant        none
// @license      Zlib
// @downloadURL https://update.greasyfork.org/scripts/515584/BloxD%20For%20Low-End%20PC%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/515584/BloxD%20For%20Low-End%20PC%27s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetFPS = 60;
    let lastTime = performance.now();

    function darkenSky() {
        const sky = document.querySelector('canvas');
        if (sky) {
            let ctx = sky.getContext('2d');
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, sky.width, sky.height);
        }
    }

    function optimizeFPS() {
        removeUnnecessaryScripts();
        removeUnnecessaryDOMElements();
        disableAnimations();
        reduceGraphicsQuality();
    }

    function removeUnnecessaryScripts() {
        const unnecessaryScripts = ["unnecessary-script.js", "another-unnecessary-script.js"];
        unnecessaryScripts.forEach(scriptName => {
            const script = document.querySelector(`script[src*="${scriptName}"]`);
            if (script) {
                script.parentNode.removeChild(script);
            }
        });
    }

    function removeUnnecessaryDOMElements() {
        const elementsToRemove = document.querySelectorAll('.unnecessary-class, .another-unnecessary-class');
        elementsToRemove.forEach(element => {
            element.parentNode.removeChild(element);
        });
    }

    function disableAnimations() {
        const animatedElements = document.querySelectorAll('*');
        animatedElements.forEach(element => {
            element.style.animation = 'none';
            element.style.transition = 'none';
        });
    }

    function reduceGraphicsQuality() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.width = window.innerWidth * 0.5;
            canvas.height = window.innerHeight * 0.5;
        }
    }

    function gameLoop() {
        const now = performance.now();
        const delta = now - lastTime;

        if (delta > (1000 / targetFPS)) {
            lastTime = now - (delta % (1000 / targetFPS));
            darkenSky();
        }

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
    optimizeFPS();
})();
