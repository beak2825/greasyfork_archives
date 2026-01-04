// ==UserScript==
// @name         Paper Scissors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes annoying unclosable modal window
// @author       IllidariCat
// @match        https://paperapp.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paperapp.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456138/Paper%20Scissors.user.js
// @updateURL https://update.greasyfork.org/scripts/456138/Paper%20Scissors.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timeout = undefined;
    console.log("Scissors loaded");
    document.addEventListener("click", () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            const modal = document.getElementById("fixedModal");
            const fade = [...document.getElementsByClassName("modal-backdrop fade show")];
            if (modal) {
                modal.style.display = "none";
            }
            if (fade) {
                fade.forEach(e => { e.style.display = "none" });
            }
            document.body.style.overflow = "scroll";
        }, 250);
    })
})();