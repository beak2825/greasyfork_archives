// ==UserScript==
// @name         Varrendero
// @namespace    voxel.vandal.varrendero
// @version      2024-09-08
// @license      Public Domain
// @description  Clean the room
// @author       CapitanChorizo
// @match        https://vandal.elespanol.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elespanol.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507540/Varrendero.user.js
// @updateURL https://update.greasyfork.org/scripts/507540/Varrendero.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ref_comp_style = window.getComputedStyle(document.body);
    const ref_cursor = ref_comp_style.getPropertyValue("cursor");
    if (ref_cursor.includes("astrobot")) {
        const css = "body.astrobot, body, body > * { cursor: default !important } a, .falsolink { cursor: pointer !important }"
        const style_elm = document.createElement('style');
        style_elm.setAttribute('type', 'text/css');
        style_elm.appendChild(document.createTextNode(css));
        document.head.appendChild(style_elm);
    }
})();