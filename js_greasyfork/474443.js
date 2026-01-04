// ==UserScript==
// @name         DigDig.io AmongusFall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a snowfall effect to digdig.io with AMONGUS
// @author       Your Name
// @match        *://digdig.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474443/DigDigio%20AmongusFall.user.js
// @updateURL https://update.greasyfork.org/scripts/474443/DigDigio%20AmongusFall.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const snowflakeStyle = `
        .snowflake {
            position: absolute;
            width: 30px;
            height: 30px;
            pointer-events: none;
            animation: fall linear infinite;
        }

        @keyframes fall {
            from {
                transform: translateY(-30px) rotate(0deg);
            }
            to {
                transform: translateY(${window.innerHeight}px) rotate(360deg);
            }
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(snowflakeStyle));
    document.head.appendChild(styleElement);

    // Función para crear un copo de nieve con la imagen de Among Us
    function createSnowflake() {
        const snowflake = document.createElement('img');
        snowflake.classList.add('snowflake');
        snowflake.src = 'https://i.imgur.com/fenZUbH.png';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.animationDuration = Math.random() * 5 + 2 + 's';
        document.body.appendChild(snowflake);

        snowflake.addEventListener('animationiteration', () => {
            snowflake.remove();
        });
    }

    function createSnowfall() {
        setInterval(createSnowflake, 500); // Agrega un nuevo copo cada medio segundo
    }

    createSnowfall();
})();
