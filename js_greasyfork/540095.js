// ==UserScript==
// @name         Darkenator: Wikipedia Dark Mode
// @namespace    https://github.com/DevaanshPathak/darkenator
// @version      1.0
// @description  Toggleable dark mode for Wikipedia. Easy on the eyes. 🌙
// @author       Devaansh
// @license MIT
// @match        https://*.wikipedia.org/*
// @icon         https://en.wikipedia.org/static/favicon/wikipedia.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540095/Darkenator%3A%20Wikipedia%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540095/Darkenator%3A%20Wikipedia%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🔥 Dark mode CSS
    const darkCSS = `
        html, body {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        a, a:visited {
            color: #8ab4f8 !important;
        }

        #content, .mw-page-container, .mw-parser-output {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        table, .infobox, .wikitable {
            background-color: #1e1e1e !important;
            color: #ccc !important;
        }

        th, td {
            border-color: #333 !important;
        }

        img {
            filter: brightness(0.9) contrast(1.1);
        }
    `;

    // 🧵 Style Element
    const style = document.createElement("style");
    style.id = "darkenator-style";
    style.textContent = darkCSS;

    // 🌓 Toggle Button
    const button = document.createElement("button");
    button.textContent = "🌓";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "9999";
    button.style.padding = "10px 15px";
    button.style.borderRadius = "10px";
    button.style.border = "none";
    button.style.background = "#333";
    button.style.color = "#fff";
    button.style.cursor = "pointer";
    button.style.fontSize = "18px";
    button.style.boxShadow = "0 0 10px #000";
    button.title = "Toggle Dark Mode";

    let enabled = false;

    button.onclick = () => {
        enabled = !enabled;
        if (enabled) {
            document.head.appendChild(style);
        } else {
            document.getElementById("darkenator-style")?.remove();
        }
    };

    // 🧷 Wait until body is ready
    const interval = setInterval(() => {
        if (document.body) {
            document.body.appendChild(button);
            clearInterval(interval);
        }
    }, 100);
})();
