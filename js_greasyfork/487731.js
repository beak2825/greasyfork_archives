// ==UserScript==
// @name        Arras.io Rainbow Theme 2024
// @version     1.0.4
// @author      theo
// @namespace   Rainbowify your game
// @description This script makes your team rainbow, you can change the colors too! It works on all the teams too!!! Fixed bugs.
// @match       *://arras.io/
// @match       *://arras.cx/
// @run-at document-load
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/487731/Arrasio%20Rainbow%20Theme%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/487731/Arrasio%20Rainbow%20Theme%202024.meta.js
// ==/UserScript==

const SIZE = 150;
const SAME = false;

(async () => {
    while (!window.Arras() || !window.Arras().themeColor || !window.Arras().themeColor.table) {
        await new Promise(r => setTimeout(r, 40));
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.3.7/chroma.min.js";
    document.head.append(script);

    script.onload = () => {
        const scale = chroma.scale(["red","orange","yellow","green","blue","purple"]).colors(SIZE);
        const teamColors = [10, 11, 12,15]; // blue, green, red, purple
        let index = 0;

        function updateColors() {
            const colors = window.Arras().themeColor.table;

            for (let color = 0; color < colors.length; color++) {
                if (teamColors.indexOf(color) < 0) continue;

                if (color === 11) {
                    colors[color] = chroma.scale(["green", "yellow"]).colors(SIZE)[index % SIZE];
                } else if (color === 12) {
                    colors[color] = chroma.scale(["red","black"]).colors(SIZE)[index % SIZE];
                                    } else if (color === 15) {
                    colors[color] = chroma.scale(["purple","blue"]).colors(SIZE)[index % SIZE];


                } else {
                    if (!SAME) {
                        colors[color] = scale[(index + (teamColors.indexOf(color) * SIZE / 4)) % SIZE];
                    } else {
                        colors[color] = scale[index % SIZE];
                    }
                }
            }
            index++;
            index = index % SIZE;
        }

        setInterval(updateColors);
    };
})();