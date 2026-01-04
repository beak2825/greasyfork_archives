// ==UserScript==
// @name         CubeCraft Rainbow NameTag
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  makes your nametag on the cubecraft forums rainbow coloured
// @author       cobvig
// @match        https://www.cubecraft.net/*
// @match        https://www.cubecraft.net/forums/*
// @match        https://www.cubecraft.net/forums*
// @match        https://www.cubecraft.net/threads/*
// @match        https://www.cubecraft.net/members*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40515/CubeCraft%20Rainbow%20NameTag.user.js
// @updateURL https://update.greasyfork.org/scripts/40515/CubeCraft%20Rainbow%20NameTag.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let c = 0;
    setInterval(function() {
        $("a:contains('"+$(".accountUsername span").html()+"')").css("color", hex4hue(c)); //Credit to Landviz for that. ^o^
        c = (c + 4) % 360;
    }, 50);
})();

hslToHex = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

hex4hue = (hue) => {
    const hex = hslToHex(hue, 80, 50);
    return hex.toUpperCase();
};
