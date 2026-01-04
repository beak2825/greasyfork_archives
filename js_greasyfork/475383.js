// ==UserScript==
// @name         Remove Maprunner Avatar and Background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Maprunner Avatar and Background from the webpage
// @author       TheM1sty
// @match        www.geoguessr.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475383/Remove%20Maprunner%20Avatar%20and%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/475383/Remove%20Maprunner%20Avatar%20and%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified HTML element
    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    // Find and remove the avatar element
    const avatarElement = document.querySelector('.maprunner-start-page_avatarWrapper__sQsZv');
    if (avatarElement) {
        removeElement(avatarElement);
    }

    // Find and remove the background element
    const backgroundElement = document.querySelector('.maprunner-signed-in-start-page_backgroundWrapper__LOeXW');
    if (backgroundElement) {
        removeElement(backgroundElement);
    }
})();
