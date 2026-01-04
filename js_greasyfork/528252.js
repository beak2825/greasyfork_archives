// ==UserScript==
// @name         GARTİC TEMA 
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  guzeltema
// @author       akira
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528252/GART%C4%B0C%20TEMA.user.js
// @updateURL https://update.greasyfork.org/scripts/528252/GART%C4%B0C%20TEMA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyGradientColor() {
        document.querySelectorAll('strong[style*="cursor: pointer;"], span.nick').forEach(element => {
            if (!element.classList.contains('gradient-color') && element.textContent.toLowerCase() !== 'boş') {
                const animationName = `gradientMove-${Math.random().toString(36).substring(7)}`;
                const isAkira = element.textContent.toLowerCase() === 'akira';
                
                const keyframes = `
                    @keyframes ${animationName} {
                        0% { background-position: 0% 50%; }
                        100% { background-position: 200% 50%; }
                    }
                `;
                
                const style = document.createElement('style');
                style.innerHTML = keyframes;
                document.head.appendChild(style);

                if (isAkira) {
                    element.style.background = 'linear-gradient(90deg, #FF1493, #FF69B4, #FF1493)';
                } else {
                    element.style.background = 'linear-gradient(90deg, #FFA500, #FFD700, #FFA500)';
                }
                
                element.style.backgroundSize = '200% auto';
                element.style.webkitBackgroundClip = 'text';
                element.style.color = 'transparent';
                element.style.animation = `${animationName} 5s linear infinite`;
                element.classList.add('gradient-color');
            }
        });
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .soft-transition {
            animation-duration: 5s;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
            animation-iteration-count: infinite;
        }
        body {
            background-color: #102144 !important;
        }
        div, *:not(body) {
            background-color: #152b59 !important;
        }
    `;
    document.head.appendChild(style);

    function changeBackgroundColors() {
        document.querySelectorAll('*').forEach(element => {
            if (element.tagName.toLowerCase() === 'body') {
                element.style.backgroundColor = '#102144';
            } else {
                element.style.backgroundColor = '#152b59';
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