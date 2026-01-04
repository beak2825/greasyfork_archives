// ==UserScript==
// @name           Swatchseries Autoplay
// @version        0.1
// @description    Swatchseries - Autoplay shows and movies in fullscreen mode when page loads.
// @author         xyfrlmuusgy
// @include        https://swatchseries.is/*
// 
// @namespace https://greasyfork.org/en/users/966232
// @downloadURL https://update.greasyfork.org/scripts/452446/Swatchseries%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/452446/Swatchseries%20Autoplay.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    function rafAsync() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }
    async function checkElement(selector) {
        let querySelector = null;
        while (querySelector === null) {
            await rafAsync();
            querySelector = document.querySelector(selector);
        }
        return querySelector;
    }
    checkElement('video').then(element => {
        const newScript = document.createElement("script");
        const inlineScript = document.createTextNode("jwplayer().play();jwplayer().setFullscreen(true);");
        newScript.appendChild(inlineScript);
        const target = document.body;
        target.appendChild(newScript);
    });
})();