// ==UserScript==
// @name         жучий костюм
// @namespace    http://tampermonkey.net/
// @version      2025-02-18
// @description  жуки делают бзззз
// @author       sheeesha
// @match        http*://*.catwar.net/*
// @match        http*://*.catwar.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526534/%D0%B6%D1%83%D1%87%D0%B8%D0%B9%20%D0%BA%D0%BE%D1%81%D1%82%D1%8E%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/526534/%D0%B6%D1%83%D1%87%D0%B8%D0%B9%20%D0%BA%D0%BE%D1%81%D1%82%D1%8E%D0%BC.meta.js
// ==/UserScript==

(function() {
    document.querySelector('head').innerHTML += `<style>

div[style*="/cw3/composited/008d773beb857948.png"] {
background-image: url(https://i.ibb.co/Ndjc9P4c/image.png) !important; }

div[style*="/cw3/composited/497d2953b2a75c0f.png"] {
background-image: url(https://i.ibb.co/wF81HJNz/image.png) !important; }


</style>`;
})();