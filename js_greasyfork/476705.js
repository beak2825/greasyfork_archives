// ==UserScript==
// @name         Remove World Cup Countdown
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the World Cup Countdown from geoguessr.com
// @author       TheM1sty
// @match        https://www.geoguessr.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476705/Remove%20World%20Cup%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/476705/Remove%20World%20Cup%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements by matching attribute values
    function removeElementsByAttribute(attributeName, attributeValue) {
        var elements = document.querySelectorAll('[' + attributeName + '="' + attributeValue + '"]');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }

    // Remove elements with the specified attribute values
    removeElementsByAttribute('href', '/world-cup');
})();