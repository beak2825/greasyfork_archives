// ==UserScript==
// @name         GARTİC TEMA 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  guzeltema
// @author       akira
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517300/GART%C4%B0C%20TEMA.user.js
// @updateURL https://update.greasyfork.org/scripts/517300/GART%C4%B0C%20TEMA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyGradientColor() {
        document.querySelectorAll('strong[style*="cursor: pointer;"]').forEach(element => {
            if (!element.classList.contains('gradient-color')) {
                const animationName = `gradientMove-${Math.random().toString(36).substring(7)}`;
                const keyframes = `
                    @keyframes ${animationName} {
                        0% { background-position: 0% 50%; }
                        100% { background-position: 200% 50%; }
                    }
                `;
                
                const style = document.createElement('style');
                style.innerHTML = keyframes;
                document.head.appendChild(style);

                element.style.background = 'linear-gradient(90deg, yellow, orange, yellow)';
                element.style.backgroundSize = '200% auto';
                element.style.webkitBackgroundClip = 'text';
                element.style.color = 'transparent';
                element.style.animation = `${animationName} 8s linear infinite`;
                element.classList.add('gradient-color');
            }
        });
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .soft-transition {
            animation-duration: 8s;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }
        body {
            background-color: black !important;
            filter: saturate(1.5);
        }
    `;
    document.head.appendChild(style);

    function changeBackgroundColors() {
        document.querySelectorAll('div').forEach(div => {
            const currentColor = window.getComputedStyle(div).backgroundColor;
            if (currentColor !== 'rgb(0, 0, 0)' && currentColor !== 'rgba(0, 0, 0, 0)') {
                div.style.backgroundColor = 'black';
            }
        });
    }

    setInterval(() => {
        applyGradientColor();
        changeBackgroundColors();
    }, 1);

    const observer = new MutationObserver(() => {
        changeBackgroundColors();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
