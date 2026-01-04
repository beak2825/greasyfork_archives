// ==UserScript==
// @name         HaremHeroes Mobile Viewport Change
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the viewport in mobile devices
// @author       Jaraya
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393427/HaremHeroes%20Mobile%20Viewport%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/393427/HaremHeroes%20Mobile%20Viewport%20Change.meta.js
// ==/UserScript==

(function() {
    var viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=1026px, user-scalable=0');
})();