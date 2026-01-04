// ==UserScript==
// @name         Anti-Builder Sans
// @namespace    bigjackson.github.io
// @version      4
// @description  Restores HCo Gotham SSm!
// @author       bigjackson
// @match        *://*.roblox.com/*
// @icon         https://tiermaker.com/images/chart/chart/homestuck-humans---alpha-beta-and-ancestor-trolls-410888/21kankrispritepng.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496031/Anti-Builder%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/496031/Anti-Builder%20Sans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceFont(element) {
        var style = window.getComputedStyle(element);
        var fontFamily = style.fontFamily;
        if (fontFamily.includes('Builder Sans')) {
            element.style.fontFamily = fontFamily.replace(/Builder Sans/g, 'HCo Gotham SSm');
            console.log('Replaced Builder Sans in element:', element);
        }
        if (fontFamily.includes('Helvetica')) {
            element.style.fontFamily = fontFamily.replace(/Helvetica/g, 'Arial');
            console.log('Replaced Helvetica in element:', element);
        }
    }

    function replaceFontsInNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            replaceFont(node);
            node.querySelectorAll('*').forEach(replaceFont);
        }
    }

    function replaceFonts() {
        document.querySelectorAll('*').forEach(replaceFont);
    }

    window.addEventListener('load', function() {
        replaceFonts();
        setTimeout(replaceFonts, 500);
    });

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceFontsInNode(node);
                }
            });
        });
    });
    observer.observe(document.body, { subtree: true, childList: true });
})();
