// ==UserScript==
// @name         Roblox Gotham Font
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get the original font back
// @author       choccy
// @match        *://*.roblox.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492940/Roblox%20Gotham%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/492940/Roblox%20Gotham%20Font.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var customFont = 'HCo Gotham SSm';

    var css = '* { font-family: "' + customFont + '" !important; } ' +
              '.builder-font, .game-card-container, .game-card-name { font-weight: 500 !important; } ' +
              '#mostPlayedContainer .game-card-container { height: 130px !important; }'; // Added #mostPlayedContainer prefix

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    head.appendChild(style);
    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

})();
