// ==UserScript==
// @name         YouTube Old UI
// @namespace    https://github.com/JamesCicada
// @version      1.0
// @description  Customizes YouTube page on load
// @author       JamesCicada
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489169/YouTube%20Old%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/489169/YouTube%20Old%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function deletePrimaryElement() {
        var primaryElement = document.querySelector('ytd-watch-grid[cinematics-enabled] #primary.ytd-watch-grid');
        if (primaryElement) {
            primaryElement.parentNode.removeChild(primaryElement);
        }
    }

    function modifySecondaryElementStyle() {
        var secondaryElement = document.querySelector('ytd-watch-grid[cinematics-enabled] #secondary.ytd-watch-grid');
        if (secondaryElement) {
            secondaryElement.style.width = '-webkit-fill-available';
        }
    }

    // Call the functions
    deletePrimaryElement();
    modifySecondaryElementStyle();
})();
