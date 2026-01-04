// ==UserScript==
// @name         Multicolor Crosshair (RAINBOW EDITION)
// @version      0.1
// @description  Rainbow crosshair in shell shockers! Be the you that you were always meant to be! 🏳️‍🌈
// @match        *://shellshock.io/*
// @author       A3+++
// @run-at       document-body
// @grant        Math.mod
// @grant        window.extern
// @namespace    https://greasyfork.org/users/815159
// @downloadURL https://update.greasyfork.org/scripts/432423/Multicolor%20Crosshair%20%28RAINBOW%20EDITION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432423/Multicolor%20Crosshair%20%28RAINBOW%20EDITION%29.meta.js
// ==/UserScript==

(function () {
    function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    const colors = [[], [], []];

    for (let wl = 0; wl < 100; wl++) {
        const {
            r,
            g,
            b
        } = HSVtoRGB(wl / 100.0 * 0.85, 1.0, 1.0);

        colors[0].push(r);
        colors[1].push(g);
        colors[2].push(b);
    }

    let crosshairs = [];
    let crosshairsSet = false;
    let colorIdx = 0;
    setInterval(function () {
        if (!crosshairsSet && typeof crosshair1 === "object") {

            for (let i = 0; i < 4; i++) {
                crosshairs.push(document.getElementById("crosshair" + i));
            }
            crosshairsSet = true;
        }

        if (typeof extern !== "undefined" && extern.inGame) {
            for (let i = 0; i < 4; i++) {
                let ch = crosshairs[i];
                const idx = Math.mod(Math.floor(colorIdx + 30 * i), 100);
                const colorString = `rgb(${colors[0][idx]}, ${colors[1][idx]}, ${colors[2][idx]})`;
                ch.style.backgroundColor = colorString;
                ch.style.color = colorString;

            }

            colorIdx += 0.89;
            if (colorIdx >= 100) {
                colorIdx = 0;
            }
        }

    }, 33);
}())
