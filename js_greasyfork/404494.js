// ==UserScript==
// @name         forbes-shutup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  block forbes login popup and re-enable scroll
// @author       tlrib
// @match        https://www.forbes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404494/forbes-shutup.user.js
// @updateURL https://update.greasyfork.org/scripts/404494/forbes-shutup.meta.js
// ==/UserScript==



(function() {
    'use strict';

    let observer = new MutationObserver((mutations) => {

        mutations.forEach((m) => {

            if (document.querySelector(".fbs-auth__container.fbs-auth__adblock")) {
                console.info("ForbesShutup: removing login popup");
                document.querySelector(".fbs-auth__container.fbs-auth__adblock").style.display = "none";
            }

            if (document.querySelector(".adblock-on.body--no-scroll")) {
                console.info("ForbesShutup: reenabling scroll");
                document.querySelector(".adblock-on.body--no-scroll").style.overflow = "scroll";
            }



        });
    });

    observer.observe(document.querySelector("body"), {
        attributes: true,
    });
})();