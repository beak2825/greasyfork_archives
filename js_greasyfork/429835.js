// ==UserScript==
// @name         itv player keyboard shortcuts
// @namespace    https://jinpark.net/
// @version      0.1.2
// @description  add keyboard shortcuts to itv player
// @author       Jin Park
// @match        https://www.itv.com/hub/*/*
// @icon         https://www.google.com/s2/favicons?domain=itv.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429835/itv%20player%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/429835/itv%20player%20keyboard%20shortcuts.meta.js
// ==/UserScript==
/* jshint esversion:6 */
(function() {
    window.onload = (event) => {

        document.addEventListener('keydown', event => {
        var b = document.querySelector("button.controls-toggle_button--play-pause");
            if (event.code === 'Space') {
                event.preventDefault();
                b.click();
            }
        });

        document.addEventListener('keyup', event => {
            var v = document.querySelector("video");

            if (event.code === 'ArrowLeft') {
                event.preventDefault();
                v.currentTime = v.currentTime - 5;
            }
            if (event.code === 'ArrowRight') {
                event.preventDefault();
                v.currentTime = v.currentTime + 5;
            }
        });
    }
})();