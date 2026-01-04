// ==UserScript==
// @license      MIT
// @name         Old Discord Font
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change gg sans to Whitney 
// @author       The Lettuce Man
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455972/Old%20Discord%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/455972/Old%20Discord%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // taken from https://stackoverflow.com/a/38133146/12922523
    function changeStylesheetRule(stylesheet, selector, property, value) {
        selector = selector.toLowerCase();
        property = property.toLowerCase();
        value = value.toLowerCase();

        for(var i = 0; i < s.cssRules.length; i++) {
            var rule = s.cssRules[i];
            if(rule.selectorText === selector) {
                rule.style[property] = value;
                return;
            }
        }

        stylesheet.insertRule(selector + " { " + property + ": " + value + "; }", 0);
    }
    var s = document.styleSheets[1];
    changeStylesheetRule(s, ":root", "--font-primary", '"Whitney","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif');
})();