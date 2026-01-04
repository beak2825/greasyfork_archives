// ==UserScript==
// @name         Hide Octotree
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It hides the Octotree button.
// @author       You
// @match        https://github.com/*
// @icon         https://assets.stickpng.com/images/5847f98fcef1014c0b5e48c0.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477476/Hide%20Octotree.user.js
// @updateURL https://update.greasyfork.org/scripts/477476/Hide%20Octotree.meta.js
// ==/UserScript==

window.addEventListener("load", (event) => {
    const bar = document.getElementsByClassName("octotree-toggle");
    bar[0].style = "opacity: 0;position: absolute;width: 10px;height: 100%;left: 215px;"
});