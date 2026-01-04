// ==UserScript==
// @name         AWBW Advance Dating by Web
// @version      0.4
// @description  This script brings back the 2023 April Fools website design, a creative work by Red.Halo (see also: https://gloriousred-halo.itch.io/adbw)
// @match        https://awbw.amarriner.com/*
// @exclude      https://awbw.amarriner.com/moveplanner.php?*
// @icon         https://awbw.amarriner.com/terrain/ani/pcfighter.gif
// @grant        none
// @namespace    https://greasyfork.org/users/1062240
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511820/AWBW%20Advance%20Dating%20by%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/511820/AWBW%20Advance%20Dating%20by%20Web.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const nell = "url('data:image/png;base64,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'):"
    const safe = (elem, style) => {
     const el = document.querySelector(elem);
        if (!!el) {
         el.style.background = style;
        }
    }
    const light = "#F8CBFD";
    const nav = "#E1AEE7"
    const dark = "#D960D1";
    const backgroundLocation = "url('https://awbw.amarriner.com/terrain/Pink_AWBW_background_2.png')";

//    const logoLocation = "https://awbw.amarriner.com/terrain/ADBW_Logo_2.png"; // Advance Dating By Web
//    const logoLocation = "https://awbw.amarriner.com/terrain/awbwlogo5.gif";   // Advanced Wobbly Boy Wars
//    const logoLocation = "https://awbw.amarriner.com/terrain/awbwlogo6.gif";   // AWBW Noir Eclipse
//    const logoLocation = "https://awbw.amarriner.com/terrain/awbwlogo7.gif";   // logo 7 ??
//    const logoLocation = "https://awbw.amarriner.com/terrain/awbwlogo8.gif";   // logo 8 ???

//    document.querySelector("#logo-background2 a img").src = logoLocation;
    document.getElementById("main").style.display = "flex"
    document.getElementById("main").style.overflow = "visible";
//    document.getElementById("map-controls-container").style.marginBottom = "20px";


// Light settings
    document.querySelector("#above-nav").style.background = nav;
    const help = document.querySelector("#nell-help img");
    if (!!help) {
    help.src= "data:image/png;base64,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"
    }
    safe("#above-nav", nav);
    safe("body", backgroundLocation);
    safe(".game-header-header", dark);
    safe("#calculator header", dark);
    safe("#outer", light);
    safe("#main", light);
    safe(".bordertitle", dark);
    const elem = document.querySelectorAll(".bordertitle");
    elem.forEach(d => d.style.background = dark);
    safe("#slideshow", light);
    safe("#slideshow-bottom", light);
    safe("#feature-flex", dark);
    safe("#slideshow-intro header", dark);
    safe("#register-login-content", light);
    safe("#nell-help img", );
})();