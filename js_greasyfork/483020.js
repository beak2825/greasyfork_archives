// ==UserScript==
// @name         Unused Skribbl.io Rainbow Skin
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Client-sided rainbow skin in skribbl.io main menu.
// @author       104xvision
// @match        https://skribbl.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483020/Unused%20Skribblio%20Rainbow%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/483020/Unused%20Skribblio%20Rainbow%20Skin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("#home > div.panels > div.panel > div.avatar-customizer > div.container > div > div.color").style.backgroundPosition = '0% -300%';
})();