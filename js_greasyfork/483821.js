// ==UserScript==
// @name         Geoguessr Color Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更改主题
// @author       lemures
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483821/Geoguessr%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/483821/Geoguessr%20Color%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        var root = document.querySelector('body');
        if(root) {

            var coloronline = getComputedStyle(root).getPropertyValue('--ds-color-green-80');
            if(coloronline) {
                root.style.setProperty('--ds-color-green-80', '#9b1712');
            }

            var colorwhite = getComputedStyle(root).getPropertyValue('--ds-color-white');
            if(colorwhite) {
                root.style.setProperty('--ds-color-white', '#b38a00');
            }

            var colormouseover = getComputedStyle(root).getPropertyValue('--ds-color-purple-20');
            if(colormouseover) {
                root.style.setProperty('--ds-color-purple-20', '#9b1712');
            }

            var colorbutton = getComputedStyle(root).getPropertyValue('--ds-color-purple-50');
            if(colorbutton) {
                root.style.setProperty('--ds-color-purple-50', '#9b1712');
            }

        }
    }, 1);
})();
