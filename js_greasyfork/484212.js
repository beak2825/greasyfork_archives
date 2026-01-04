// ==UserScript==
// @name         Eclipse Emu Black Theme
// @namespace    http://tampermonkey.net/
// @version      2024-01-08
// @description  Changes the red UI on Eclipse to black
// @author       You
// @match        https://eclipseemu.me/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eclipseemu.me
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484212/Eclipse%20Emu%20Black%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/484212/Eclipse%20Emu%20Black%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = '.emulator-page { background: none; }';
    document.head.appendChild(style);
})();