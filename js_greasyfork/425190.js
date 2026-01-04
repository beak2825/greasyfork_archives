// ==UserScript==
// @name         ScreenshotMode
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Show/Hide ALL menus/div's/elements on zombs.io
// @author       deathrain
// @match        http://zombs.io/
// @icon         http://zombs.io/asset/image/entity/gold-stash/gold-stash-t8-base.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425190/ScreenshotMode.user.js
// @updateURL https://update.greasyfork.org/scripts/425190/ScreenshotMode.meta.js
// ==/UserScript==
window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 27:
            var mb = document.getElementsByClassName("hud")[0];
            if (mb.style.display === "none") {
                mb.style.display = "block";
            } else {
                mb.style.display = "none";
            }
            break;
    }
})