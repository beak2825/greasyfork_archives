// ==UserScript==
// @name         Change font to old
// @namespace    http://tampermonkey.net/
// @version      2024-04-19
// @description  Made by TheMoon
// @author       You
// @match        https://*.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      TheMoonSir - Change from new font to old font
// @downloadURL https://update.greasyfork.org/scripts/492958/Change%20font%20to%20old.user.js
// @updateURL https://update.greasyfork.org/scripts/492958/Change%20font%20to%20old.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeFontFamilyInCSS(cssRules, fontFamilyToChange, newFontFamily) {
        for (var i = 0; i < cssRules.length; i++) {
            var rule = cssRules[i];
            if (rule.selectorText && rule.selectorText.indexOf('.builder-font') !== -1) {
                rule.style.fontFamily = rule.style.fontFamily.replace(fontFamilyToChange, newFontFamily);
            }
        }
    }

    var cssFile = 'https://css.rbxcdn.com/aa78e65cb877e92d8c8b6b41a7715271d322530edabcf2c41f7510b5a956c637.css';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', cssFile, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var cssText = xhr.responseText;
            var styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.appendChild(document.createTextNode(cssText));
            document.head.appendChild(styleElement);
            var cssRules = styleElement.sheet.cssRules || styleElement.sheet.rules;
            changeFontFamilyInCSS(cssRules, 'Builder Sans', 'HCo Gotham SSm');
        }
    };
    xhr.send(null);
})();
