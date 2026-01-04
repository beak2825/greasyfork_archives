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
// @downloadURL https://update.greasyfork.org/scripts/448018/Rainbow%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/448018/Rainbow%20Skin.meta.js
// ==/UserScript==


(function() {
    if (
        typeof config !== "undefined"
    ) {
        let hslCount = 0;
        setInterval((skinColors) => {
            const hsl = `hsl(${hslCount >> 2},  100%, 50%)`;
            if (typeof skinColors == typeof config) {
                window.config.skinColors[4] = hsl;
                skinColors[4].style.backgroundColor = hsl;
                hslCount += 500;

            }
        }, 10, document.getElementsByClassName('skinColorItem'))
    }
})();v