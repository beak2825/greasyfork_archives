// ==UserScript==
// @name         Rainbow Skin
// @namespace   -
// @version      v1
// @description Rainbow Skin Fast
// @author       You Mom
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://mm_beta.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445062/Rainbow%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/445062/Rainbow%20Skin.meta.js
// ==/UserScript==


(function() {
    if (
        typeof config !== "undefined"
    ) {
        let hslCount = 0;
        setInterval((skinColors) => {
            const hsl = `hsl(${hslCount >> 2},  100%, 50%)`;
            if (typeof skinColors == typeof config) {
                window.config.skinColors[1] = hsl;
                window.config.skinColors[2] = hsl;
                window.config.skinColors[3] = hsl;
                window.config.skinColors[0] = hsl;
                window.config.skinColors[4] = hsl;
                window.config.skinColors[5] = hsl;
                window.config.skinColors[6] = hsl;
                window.config.skinColors[7] = hsl;
                window.config.skinColors[8] = hsl;
                window.config.skinColors[9] = hsl;
                window.config.skinColors[10] = hsl;
                skinColors[1].style.backgroundColor = hsl;
                skinColors[0].style.backgroundColor = hsl;
                skinColors[2].style.backgroundColor = hsl;
                skinColors[3].style.backgroundColor = hsl;
                skinColors[4].style.backgroundColor = hsl;
                skinColors[5].style.backgroundColor = hsl;
                skinColors[6].style.backgroundColor = hsl;
                skinColors[7].style.backgroundColor = hsl;
                skinColors[8].style.backgroundColor = hsl;
                skinColors[9].style.backgroundColor = hsl;
                hslCount += 500;

            }
        }, 10, document.getElementsByClassName('skinColorItem'))
    }
})();