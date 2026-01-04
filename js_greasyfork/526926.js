// ==UserScript==
// @name         Bit.ly Auto Skip
// @namespace    https://spin.rip/
// @version      2025-02-14
// @description  Automatically clicks the "continue to destination" button
// @author       Spinfal
// @match        https://bit.ly/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bit.ly
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526926/Bitly%20Auto%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/526926/Bitly%20Auto%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //window.onload = () => {
        const check = setInterval(() => {
            if (document?.getElementById("action:continue")) {
                document.getElementById("action:continue").click();
                clearInterval(check);
            }
        }, 25);
    //}
})();