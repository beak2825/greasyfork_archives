// ==UserScript==
// @name         Diep.io Crosshair Pointer remixed
// @version      2.5
// @description  Makes the pointer crosshair and the aim easily. This script based by Mixaz017's script. Thanks a lot!
// @author       _BARLEYER_
// @include      http://diep.io/
// @namespace https://greasyfork.org/ja/users/161581
// @downloadURL https://update.greasyfork.org/scripts/442090/Diepio%20Crosshair%20Pointer%20remixed.user.js
// @updateURL https://update.greasyfork.org/scripts/442090/Diepio%20Crosshair%20Pointer%20remixed.meta.js
// ==/UserScript==

function skinloop() {
    gamename = document.querySelector("meta[property='og:url']")?.content.match(/^.+\/(.*?)(?:$|\?)/)[1];
    switch (gamename) {
        case "solo": {
            [...document.querySelectorAll(".single_card, .stockitem")].forEach(elem => elem.style["background-image"] = "url('https://i.imgur.com/oNeen3B.png')");
        } break;
    }
    requestAnimationFrame(skinloop);
}

skinloop();