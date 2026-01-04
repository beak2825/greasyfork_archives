// ==UserScript==
// @name        Active Dungeons Only - pendcalc.karubo.de
// @namespace   https://xpuls3.github.io/
// @include     http://pendcalc.karubo.de/
// @grant       none
// @version     0.1.0
// @author      Puls3
// @description 4/25/2021, 9:58:31 AM
// @downloadURL https://update.greasyfork.org/scripts/425538/Active%20Dungeons%20Only%20-%20pendcalckarubode.user.js
// @updateURL https://update.greasyfork.org/scripts/425538/Active%20Dungeons%20Only%20-%20pendcalckarubode.meta.js
// ==/UserScript==

// Its not pretty - but meh.

window.addEventListener("DOMContentLoaded", async () => {

    const elem = document.createElement("style");
    elem.innerText = `` +
        `#roitable > tbody > tr:nth-child(1) { display: none; }` +
        `#roitable > tbody > tr > *:nth-child(3) { display: none; }` +
        `#roitable > tbody > tr > *:nth-child(4) { display: none; }` +
        `#roitable > tbody > tr > *:nth-child(5) { display: none; }` +
        `#roitable > tbody > tr > *:nth-child(6) { display: none; }` +
        `#roitable > tbody > tr > *:nth-child(7) { display: none; }` +
        `#roitable > tbody > tr > *:nth-child(8) { display: none; }` +
        '';

    document.head.append(elem);

});