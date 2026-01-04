// ==UserScript==
// @name         TypeRacer Next Race Button
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Lets you go to the next race by pressing enter. You can change the key in the code (it's very intuitive)
// @author       AlphaLeoli
// @match        https://play.typeracer.com
// @license      CC BY-NC-SA 4.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496580/TypeRacer%20Next%20Race%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/496580/TypeRacer%20Next%20Race%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            var button = document.querySelector('a.gwt-Anchor.raceAgainLink.raceAgainLink-green');
            if (button) {
                button.click();
            }
        }
    });
})();