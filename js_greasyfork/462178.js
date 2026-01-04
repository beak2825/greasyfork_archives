// ==UserScript==
// @name         Mamono Sweeper Pixelated
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Disables scale filtering on mamono sweeper
// @author       Maurice
// @match        http://www.hojamaka.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hojamaka.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462178/Mamono%20Sweeper%20Pixelated.user.js
// @updateURL https://update.greasyfork.org/scripts/462178/Mamono%20Sweeper%20Pixelated.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
        canvas { image-rendering: pixelated; }
    `);
})();