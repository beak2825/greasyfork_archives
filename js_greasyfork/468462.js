// ==UserScript==
// @name         Torn Karma Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the word "Dexterity" to "Karma" on Torn.com
// @author       BitchCutter
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468462/Torn%20Karma%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/468462/Torn%20Karma%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace the word "Dexterity" with "Karma" in the page content
    function replaceDexterityWithKarma() {
        var elements = document.getElementsByTagName("*");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            for (var j = 0; j < element.childNodes.length; j++) {
                var node = element.childNodes[j];
                if (node.nodeType === 3) { // Text node
                    var text = node.nodeValue;
                    var replacedText = text.replace(/dexterity/gi, "Karma");
                    if (replacedText !== text) {
                        element.replaceChild(document.createTextNode(replacedText), node);
                    }
                }
            }
        }
    }

    // Wait for the page to load and replace "Dexterity" with "Karma"
    window.addEventListener('load', function() {
        replaceDexterityWithKarma();
    });

    // Watch for changes in the page and replace "Dexterity" with "Karma" again
    var observer = new MutationObserver(function() {
        replaceDexterityWithKarma();
    });

    // Start observing the document for changes
    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();