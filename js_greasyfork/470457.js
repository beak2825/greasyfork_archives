// ==UserScript==
// @name         CivitaiAutoShow
// @namespace    https://civitai.com/
// @version      0.1
// @description  Hover the mouse over a hidden picture to reveal it automatically
// @author       You
// @match        https://civitai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470457/CivitaiAutoShow.user.js
// @updateURL https://update.greasyfork.org/scripts/470457/CivitaiAutoShow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("mouseover", (event) => {
        var element = event.target;
        if (element.nodeName != 'CANVAS') {
            return true;
        }
        var rootElement = element.parentNode.parentNode;
        var showEyeButton = rootElement.getElementsByClassName("tabler-icon-eye")[0];
        if (showEyeButton === undefined) {
            // on the detailed page
            rootElement = rootElement.parentNode;
            showEyeButton = rootElement.getElementsByClassName("tabler-icon-eye")[0];
        }

        if (showEyeButton !== undefined) {
            showEyeButton.parentNode.click();
        }
    });
})();