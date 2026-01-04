// ==UserScript==
// @name         Bonk.io Fullscreen
// @namespace    http://tampermonkey.net/
// @version      2025-03-29
// @description  A simpler, and less laggy fullscreen button for Bonk.io.
// @author       You
// @match        https://bonk.io
// @icon         https://bonk.io/graphics/tt/favicon-32x32.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531191/Bonkio%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/531191/Bonkio%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        const frame = document.getElementById("maingameframe").contentWindow;
        const container = frame.document.getElementById("bonkiocontainer");

        const style = document.createElement("style");
        style.textContent = `
          canvas {
            display: block;
            margin: auto;
          }
        `;

        frame.document.head.appendChild(style);

        const button = document.createElement("button");
        button.innerHTML = "Fullscreen";

        Object.assign(button.style, {
            position: "absolute",
            left: "0px",
            lineHeight: "31px",
            background: "none",
            border: "none",
            color: "rgb(255 255 255 / 25%)",
            fontFamily: "futurept_b1",
            fontSize: "17px",
            cursor: "pointer",
        });

        button.addEventListener("click", () => {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        });

        const header = document.getElementById("bonkioheader");
        header.appendChild(button);
    };
})();