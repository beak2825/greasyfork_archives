// ==UserScript==
// @name         Hulu Logo Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the logo overlay from the bottom right of your screen while streaming on Hulu.
// @author       MoTl0n
// @match        https://www.hulu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420972/Hulu%20Logo%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/420972/Hulu%20Logo%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ref = document.querySelector('script');
    var style = document.createElement("style")
    style.innerHTML ='#web-player-app > div.ControlsContainer > img { display:none !important}';
    ref.parentNode.insertBefore(style, ref);
//console.log('script fired')
})();