// ==UserScript==
// @name         Cute Font in Narrow One :3
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Font Style Changed :3
// @icon         https://th.bing.com/th/id/OIP.80TgbMeQowE7QV-VhLKvMAHaE8?cb=iwc1&rs=1&pid=ImgDetMain
// @author       Duck
// @match        https://narrow.one/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537963/Cute%20Font%20in%20Narrow%20One%20%3A3.user.js
// @updateURL https://update.greasyfork.org/scripts/537963/Cute%20Font%20in%20Narrow%20One%20%3A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🧸 Choose cute rounded font
    const cuteFont = "'Comic Sans MS', 'Fredoka', 'Quicksand', sans-serif"; // 🎀 Cute rounded font style
    // You can also try: "'Poppins', 'Baloo', 'Nunito', sans-serif"; if you prefer

    // 🌸 Create CSS to change all fonts in the game
    const style = document.createElement("style");
    style.innerHTML = `
        body, div, span, h1, h2, h3, h4, h5, h6, p, a, button, input {
            font-family: ${cuteFont} !important;
        }
    `;
    document.head.appendChild(style);

    console.log("🎀 Narrow.One font has been changed to cute rounded style!");
})();