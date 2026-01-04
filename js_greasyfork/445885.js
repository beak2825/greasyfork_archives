// ==UserScript==
// @name         V3rmillion Ukraine Logo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the shitty new v3rmillion logo
// @author       HyperNite
// @match        https://v3rmillion.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v3rmillion.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445885/V3rmillion%20Ukraine%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/445885/V3rmillion%20Ukraine%20Logo.meta.js
// ==/UserScript==

(function() {
    document.querySelector("link[rel~='icon']").href="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://v3rmillion.net&size=64"
})();