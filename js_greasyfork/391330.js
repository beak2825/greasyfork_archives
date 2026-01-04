// ==UserScript==
// @name         ig-shutup
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  block instagram login popup and re-enable scroll
// @author       tlrib
// @match        https://www.instagram.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/391330/ig-shutup.user.js
// @updateURL https://update.greasyfork.org/scripts/391330/ig-shutup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver((mutations) => {

        mutations.forEach((m) => {
            m.target.style.overflow = "scroll";

            if (document.querySelector(".rq0escxv.l9j0dhe7.du4w35lb")) {
                console.info("IgShutup: removing login popup");
                document.querySelector(".rq0escxv.l9j0dhe7.du4w35lb").remove();
            }
        });
    });

    observer.observe(document.querySelector("body"), {
        attributes: true,
    });
})();