// ==UserScript==
// @name         MooMoo.io DarkMode
// @author       unknown
// @description  Darker visual for moomoo, Press "P" for toggle.
// @version      1.1
// @match        *://*.moomoo.io/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1049693
// @downloadURL https://update.greasyfork.org/scripts/463530/MooMooio%20DarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/463530/MooMooio%20DarkMode.meta.js
// ==/UserScript==

window.addEventListener("load", () => {

    let toggleRender = true;
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    let screenWidth = 1920;
    let screenHeight = 1080;
    let screenW = screenWidth / 2;
    let screenH = screenHeight / 2;

    function render() {

        if (toggleRender) {

            ctx.beginPath();

            let gradient = ctx.createRadialGradient(screenW, screenH, 0, screenW, screenH, screenWidth);
            for (let i = 0; i <= 1; i++) {
                gradient.addColorStop(i, "rgba(0, 0, 0, " + i + ")");
            }

            ctx.fillStyle = gradient;
            ctx.rect(0, 0, screenWidth, screenHeight);
            ctx.fill();

        }

        window.requestAnimFrame(render);

    }

    render();

    let keys = {};
    addEventListener("keydown", function(event) {
        if (!keys[event.keyCode]) {
            keys[event.keyCode] = true;
            if (event.keyCode == 80) {
                toggleRender = !toggleRender;
            }
        }
    });
    window.addEventListener("keyup", function(event) {
        if (keys[event.keyCode]) {
            keys[event.keyCode] = false
        }
    });
});