// ==UserScript==
// @name         FetLife: save/copy images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes it possible to save/copy images on FetLife
// @author       You
// @match        https://fetlife.com/users/*/pictures/*
// @icon         https://fetlife.com/favicons/favicon.ico
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477867/FetLife%3A%20savecopy%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/477867/FetLife%3A%20savecopy%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList) => {
        const filtered =
            mutationsList
                .filter(x =>
                    x.addedNodes &&
                    x.addedNodes[0] &&
                    x.addedNodes[0].classList &&
                    x.addedNodes[0].classList.contains("mx-auto"))
                .map(x => x.addedNodes[0]);

        if (filtered.length > 1) {
            const parent = filtered[1].querySelector(".overflow-hidden");
            const img = parent.querySelector("img.mx-auto");
            const nav = parent.querySelector("nav.absolute");

            img.style = "pointer-events: auto !important";

            while (nav.childNodes.length > 0) {
                nav.childNodes[0].style.width = "20%";
                parent.appendChild(nav.childNodes[0]);
            }

            nav.remove();

            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

})();