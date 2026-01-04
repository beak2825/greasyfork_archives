// ==UserScript==
// @name         Omerta Auto Submit Code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto submit code after being manually typed
// @author       You
// @match        https://omerta.pt/*
// @match        https://omerta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398885/Omerta%20Auto%20Submit%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/398885/Omerta%20Auto%20Submit%20Code.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("input", e => {
        const target = e.target;
        if (target.id == "ver") {
            if (target.value.length == 3) {
                target.form.querySelector("#submitAction").click();
            }
        }
    });
})();
