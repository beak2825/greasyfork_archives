// ==UserScript==
// @name         IT'S RAINING TACOS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  IT'S RAININGGGG TACOSSS
// @author       Aadoxide
// @match        *://*/*
// @icon         https://cdn.discordapp.com/attachments/779931446991126541/1152645998003368046/Taco.png
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475440/IT%27S%20RAINING%20TACOS.user.js
// @updateURL https://update.greasyfork.org/scripts/475440/IT%27S%20RAINING%20TACOS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tacos = ["🌮"];
    const elements = [];

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < 50 /* the amount of tacos */; i++) {
        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.left = `${getRandom(0, window.innerWidth)}px`;
        element.style.top = `${getRandom(-500, -50)}px`;
        element.style.fontSize = "20px"; // size of the tacos
        element.textContent = tacos[Math.floor(Math.random() * tacos.length)];
        document.body.appendChild(element);
        elements.push(element);
    }

    function rain() {
        elements.forEach((element) => {
            const currentTop = parseFloat(element.style.top);
            if (currentTop >= window.innerHeight) {
                element.style.top = `${getRandom(-50, -10)}px`;
                element.style.left = `${getRandom(0, window.innerWidth)}px`;
            } else {
                element.style.top = `${currentTop + 1}px`; // falling speed
            }
        });

        requestAnimationFrame(rain);
    }

    rain();
})();