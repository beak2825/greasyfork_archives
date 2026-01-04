// ==UserScript==
// @name         Less lag [N].
// @description  May increase fps. [N] - Toggle. Сompatible with AFK script.
// @author       hq
// @version      2.2
// @match        https://diep.io/*
// @namespace    https://discord.gg/RC2YW53qWX
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494770/Less%20lag%20%5BN%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/494770/Less%20lag%20%5BN%5D.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const canvas = document.getElementById('canvas');
    let isActive = false;
    CanvasRenderingContext2D.prototype.arc = new Proxy(CanvasRenderingContext2D.prototype.arc, {
        apply(a, b, c)
        {
            if(!isActive) return Reflect.apply(a, b, c);
        }
    });
    document.addEventListener("keydown", function({ key }) {
        if (key.toLowerCase() === 'n' || key.toLowerCase() === 'т')
        {
            isActive = !isActive;

            const factor = isActive ? 100 : 1;
            canvas.width = window.innerWidth / factor;
            canvas.height = window.innerHeight / factor;

            const ren = ["ren_health_bars", "ren_names", "ren_background", "ren_scoreboard", "ren_scoreboard_names", "ren_stats", "ren_upgrades"];
            ren.forEach(command => {
                input?.set_convar(command, !isActive);
            });
            input?.set_convar("ren_solid_background", isActive);
        }
    });
})();