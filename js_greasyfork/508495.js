// ==UserScript==
// @name         Civitai Model Versions Scroll Remover
// @version      0.0.1
// @description  Removes scrolling on Civitai model versions, allowing for easy selection for models with many alternative versions.
// @author       kaljinn
// @license      The Unlicense
// @namespace    https://civitai.com/user/kaljinn
// @match        https://civitai.com/models/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508495/Civitai%20Model%20Versions%20Scroll%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/508495/Civitai%20Model%20Versions%20Scroll%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load completely
    window.addEventListener('load', function() {
        // Select the element using the new selector
        let element = document.querySelector('.mantine-ScrollArea-viewport > div > div.mantine-Group-root');

        if (element) {
            // Apply inline CSS to change flex-wrap to wrap
            element.style.flexWrap = 'wrap';

            // Remove all previous siblings
            let prevSibling = element.previousElementSibling;
            while (prevSibling) {
                prevSibling.remove();
                prevSibling = element.previousElementSibling;
            }

            // Remove all next siblings
            let nextSibling = element.nextElementSibling;
            while (nextSibling) {
                nextSibling.remove();
                nextSibling = element.nextElementSibling;
            }
        }
    });
})();
