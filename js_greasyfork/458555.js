// ==UserScript==
// @name         Open in Steam
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a button on Steam store page that can be used to open that page inside the Steam client;
// @author       The24thDS
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458555/Open%20in%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/458555/Open%20in%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const element = document.createElement('a');
    element.setAttribute('href', `steam://openurl/${window.location.href}`);
    element.setAttribute('style', `position: absolute; top: 20px; right: 20px; padding: 5px 20px; border-radius: 5px; background-color: #c5c3c0; color: #171a21; font-weight: bold;`);
    element.innerHTML = 'Open in Steam';
    document.body.appendChild(element);
})();