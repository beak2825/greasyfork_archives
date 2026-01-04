// ==UserScript==
// @name         Safe Survival Clearer Input Field Border
// @version      0.0.1
// @description  Whoever put the super light gray border for the input fields on the site should be pricked to death by berry bushes
// @author       Dia
// @match        https://store.safesurvival.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=safesurvival.net
// @namespace    wxw.moe/@dia
// @run-at       document-idle
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/473071/Safe%20Survival%20Clearer%20Input%20Field%20Border.user.js
// @updateURL https://update.greasyfork.org/scripts/473071/Safe%20Survival%20Clearer%20Input%20Field%20Border.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let inputs = document.getElementsByTagName("input");
    for (let i=0; i<inputs.length; i++){
        inputs[0].style.borderColor = "black";
    }
})();