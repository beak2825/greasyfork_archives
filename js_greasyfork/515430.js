// ==UserScript==
// @name         Snowfall Effect
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Snowfall animation with wind effect
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515430/Snowfall%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/515430/Snowfall%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxSnowflakes = 75;
    let snowflakeCount = 0;

    const style = document.createElement("style");
    style.innerHTML = `
        .snowflake {
            position: fixed;
            top: -50px;
            color: #FFF;
            font-size: 10px;
            opacity: 0.8;
            pointer-events: none;
            user-select: none;
            z-index: 9999;
        }
        @keyframes snowfall {
            to {
                transform: translateX(var(--wind)) translateY(100vh);
            }
        }
    `;
    document.head.appendChild(style);

    function createSnowflake() {
        if (snowflakeCount >= maxSnowflakes) return;
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";
        snowflake.innerHTML = "&#10052;";
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
        snowflake.style.animation = `snowfall ${Math.random() * 3 + 5}s linear infinite`;
        snowflake.style.setProperty("--wind", `${Math.random() * 20 - 10}vw`);
        document.body.appendChild(snowflake);
        snowflakeCount++;

        snowflake.addEventListener("animationend", () => {
            snowflake.remove();
            snowflakeCount--;
        });
    }

    setInterval(createSnowflake, 200);
})();
