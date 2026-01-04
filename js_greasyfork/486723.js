// ==UserScript==
// @name         Meower Rotate
// @version      1.0.1
// @description  Rotate on mouse
// @author       Bloctans
// @grant        none
// @match        https://meo-32r.pages.dev/*
// @match        https://mybearworld.github.io/roarer/*
// @match        https://app.meower.org/*
// @match        https://*.bettermeower.app/*
// @license      MIT
// @namespace rotator!!!!
// @downloadURL https://update.greasyfork.org/scripts/486723/Meower%20Rotate.user.js
// @updateURL https://update.greasyfork.org/scripts/486723/Meower%20Rotate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("mousemove", (event) => {
        document.documentElement.style.transform = `perspective(500px) rotateX(${(event.pageY-(window.innerHeight/2)) / 6}deg) rotateY(${(event.pageX-(window.innerWidth/2)) / 6}deg) scale(0.5)`;
    });
})();
