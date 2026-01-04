// ==UserScript==
// @name         CivitAi Auto Show NSFW
// @namespace    http://irisapp.ca/
// @version      2.3
// @description  Automatically un-blur's CivitAi NSFW posts
// @author       https://github.com/RiisDev
// @match        *civitai.com/*
// @icon         https://civitai.com/favicon.ico
// @grant        none
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474203/CivitAi%20Auto%20Show%20NSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/474203/CivitAi%20Auto%20Show%20NSFW.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function unBlur() {
        document.querySelectorAll('.mantine-Button-label').forEach(element => {
            if (element.innerHTML == "Show") {
                const buttonElement = element.parentElement.parentElement;
                if (buttonElement) {
                    buttonElement.click();
                }
            }
        });
    }
    new MutationObserver(unBlur).observe(document.body, { childList: true, subtree: true, attributes: true});
    unBlur();
})();