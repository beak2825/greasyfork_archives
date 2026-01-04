// ==UserScript==
// @name         Meower Turn
// @version      1.0
// @description  Rotate on keypress
// @author       JoshAtticus
// @match        https://meo-32r.pages.dev/*
// @match        https://mybearworld.github.io/roarer/*
// @match        https://app.meower.org/*
// @match        https://*.bettermeower.app/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1253827
// @downloadURL https://update.greasyfork.org/scripts/486561/Meower%20Turn.user.js
// @updateURL https://update.greasyfork.org/scripts/486561/Meower%20Turn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let rotation = 0;
    let shake = 0;

    function shakePage() {
        if(event.keyCode === 8) { // Check if backspace key is pressed
            rotation -= 2 + shake;
            shake += 0.1;
        } else {
            rotation += 2 + shake;
            shake += 0.1;
        }

        document.documentElement.style.transform = `rotate(${rotation}deg)`;
        document.documentElement.style.transition = "transform 0.5s ease";

        document.documentElement.style.overflowX = "hidden";
    }

    document.addEventListener('keydown', function(event) {
        shakePage();
    });
})();
