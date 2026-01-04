// ==UserScript==
// @name         Shmups Forum Width/BG tweaks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Modify CSS on shmup forums to use more of the screen and dim bg image
// @author       Kez
// @match        https://shmups.system11.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=system11.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471035/Shmups%20Forum%20WidthBG%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/471035/Shmups%20Forum%20WidthBG%20tweaks.meta.js
// ==/UserScript==


(function() {
    'use strict;';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle("body {padding: 0;}");
    addGlobalStyle(".wrap {background: #040d1299; max-width: unset; height: 100%; margin:0 padding: 0;}");
    addGlobalStyle(".wrap > div {max-width: 90%; margin: auto;}");
})();