// ==UserScript==
// @name         DigDig.io Snowfall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a snowfall effect to DigDig.io
// @author       Elmero me ro meron
// @match        *://digdig.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474442/DigDigio%20Snowfall.user.js
// @updateURL https://update.greasyfork.org/scripts/474442/DigDigio%20Snowfall.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const snowflakeStyle = `
        .snowflake {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #fff;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.8;
            animation: fall linear infinite;
        }

        @keyframes fall {
            from {
                transform: translateY(-10px) rotate(0deg);
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

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.animationDuration = Math.random() * 5 + 2 + 's';
        document.body.appendChild(snowflake);

        snowflake.addEventListener('animationiteration', () => {
            snowflake.remove();
        });
    }

    function createSnowfall() {
        setInterval(createSnowflake, 500);
    }

    createSnowfall();
})();
