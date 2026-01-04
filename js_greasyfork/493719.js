// ==UserScript==
// @name         Labels Anki Decks based on hierarchy
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Just colors anki subdecks by colors of the rainbow
// @author       Kerry
// @match        https://ankiweb.net/decks
// @match        https://ankiuser.net/decks
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ankiweb.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493719/Labels%20Anki%20Decks%20based%20on%20hierarchy.user.js
// @updateURL https://update.greasyfork.org/scripts/493719/Labels%20Anki%20Decks%20based%20on%20hierarchy.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function applyStylesToElements(elements) {
        var colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

        for (var i = 0; i < elements.length; i++) {
            var html = elements[i].innerHTML;
            var count = (html.match(/&nbsp;&nbsp;&nbsp;/g) || []).length;

            for (var j = 0; j < count; j++) {
                elements[i].style.color = colors[j % colors.length];
            }
        }
    }

    function checkElementsAvailability() {
        var elements = document.getElementsByClassName('svelte-p9sq8d');
        if (elements.length > 0) {
            applyStylesToElements(elements);
        } else {
            setTimeout(checkElementsAvailability, 100);
        }
    }

    checkElementsAvailability();
})();