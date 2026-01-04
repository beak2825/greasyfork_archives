// ==UserScript==
// @name           Soap2Day Autoplay
// @version        0.1
// @description    Soap2Day - Autoplay shows and movies in fullscreen mode when page loads.
// @author         mohitdhule
// @include        https://soap2day.to/*
// @include        https://soap2day.im/*
// @include        https://soap2day.ac/*
// @include        https://soap2day.se/*
// @include        https://s2dfree.to/*
// @include        https://s2dfree.cc/*
// @include        https://s2dfree.de/*
// @include        https://s2dfree.is/*
// @include        https://s2dfree.in/*
// @include        https://s2dfree.nl/*
// @run-at         document-idle
// @namespace https://greasyfork.org/users/776541
// @downloadURL https://update.greasyfork.org/scripts/427072/Soap2Day%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/427072/Soap2Day%20Autoplay.meta.js
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
