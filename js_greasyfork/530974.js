// ==UserScript==
// @name         Discord set top bar height
// @namespace    http://tampermonkey.net/
// @version      2025-03-27
// @description  Set discord top bar height to 10px to save screen space
// @author       Glease
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530974/Discord%20set%20top%20bar%20height.user.js
// @updateURL https://update.greasyfork.org/scripts/530974/Discord%20set%20top%20bar%20height.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(function() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = ':root { --custom-app-top-bar-height: 10px; }';
        document.getElementsByTagName('head')[0].appendChild(style);
    }, 1000)
    // Your code here...
})();