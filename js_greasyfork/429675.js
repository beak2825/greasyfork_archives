// ==UserScript==
// @name         Item Exporter
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds an option to export the sprites of items you right-click on.
// @author       Zoltar
// @match        http://manyland.com/*
// @icon         https://cdn.discordapp.com/icons/852442189283983380/a_70793eeb1f509f9c4aa1021e5691fab4.webp
// @downloadURL https://update.greasyfork.org/scripts/429675/Item%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/429675/Item%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // took this part from Eternity's mod
    function loadObf() {
        if (typeof Deobfuscator === 'undefined')
            return $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js")
    }

    async function main() {
        ig.game.itemContextMenu.old_draw = ig.game.itemContextMenu.draw;


        let image = new Image();
        image.src = 'https://cdn.discordapp.com/attachments/614637022614782000/867213341953097769/arrow.png'
        image.onclick = () => consoleref.log('test')

        // Thank you Stackoverflow!
        function toDataURL(url) {
            return fetch(url).then((response) => {
                return response.blob();
            }).then(blob => {
                return URL.createObjectURL(blob);
            });
        }

        async function exportSprite(item) {
            ig.game.sounds.click.play();
            const a = document.createElement("a");
            a.href = await toDataURL(`${item.imageURL}.png`);
            a.download = `${item.name}.png`;
            document.body.appendChild(a);
            window.removeEventListener('click', clickArrow)
            a.click();
            document.body.removeChild(a);
            window.addEventListener('click', clickArrow)
        }

        function clickArrow(event) {
            if (ig.game.itemContextMenu.isOpen) {
                let selected = Deobfuscator.object(ig.game.itemContextMenu, 'thing');
                let spot = {
                    x1: (ig.game.itemContextMenu.pos.x + 102) * ig.system.scale,
                    y1: (ig.game.itemContextMenu.pos.y + 14) * ig.system.scale,
                    x2: ((ig.game.itemContextMenu.pos.x + 102) * ig.system.scale) + (11 * ig.system.scale),
                    y2: ((ig.game.itemContextMenu.pos.y + 14) * ig.system.scale) + (9 * ig.system.scale),
                    call: () => { exportSprite(selected.thing); }
                }

                let clickPos = { x: ig.input.mouse.x * ig.system.scale, y: ig.input.mouse.y * ig.system.scale }

                if (clickPos.x > spot.x1 && clickPos.x < spot.x2 && clickPos.y > spot.y1 && clickPos.y < spot.y2) {
                    spot.call();
                }
            }

        }

        window.addEventListener('click', clickArrow)

        ig.game.itemContextMenu.draw = () => {
            ig.game.itemContextMenu.old_draw();
            if (ig.game.itemContextMenu.isOpen) {
                ig.system.context.globalAlpha = 0.4;
                ig.system.context.drawImage(image, (ig.game.itemContextMenu.pos.x + 102) * ig.system.scale, (ig.game.itemContextMenu.pos.y + 14) * ig.system.scale, (11 * ig.system.scale), (9 * ig.system.scale));
                ig.system.context.globalAlpha = 1;
            }

        }

    }

    // Parses smooth loader
    !async function loader() {
        let loading = setInterval(async function () {
            if (typeof ig === "undefined") return
            else if (typeof ig.game === "undefined") return
            else if (typeof ig.game.screen === "undefined") return
            else if (ig.game.screen.x == 0) return
            else if (typeof Settings !== "function") return

            clearInterval(loading);
            await loadObf();
            main();
        }, 250)
    }()
})();