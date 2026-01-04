// ==UserScript==
// @name         CBA COPY
// @namespace    https://github.com/hamano0813
// @version      1.0
// @description  使得CBA数据网站的数据可以选中和复制
// @author       Hamanao0813
// @match        https://www.cbaleague.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483212/CBA%20COPY.user.js
// @updateURL https://update.greasyfork.org/scripts/483212/CBA%20COPY.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Remove specific CSS options
    let cssToRemove = [
        '-webkit-touch-callout',
        '-webkit-user-select',
        '-khtml-user-select',
        '-moz-user-select',
        '-ms-user-select',
        'user-select'
    ];

    // Check if the stylesheet exists
    for (let s = 0; s < document.styleSheets.length; s++) {
        var styleSheet = document.styleSheets[s];
        var cssRules = styleSheet.cssRules;
        for (var i = 0; i < cssRules.length; i++) {
            var cssRule = cssRules[i];
            if (cssRule.type === CSSRule.STYLE_RULE) {
                cssToRemove.forEach(function(cssProperty) {
                    if (cssRule.style[cssProperty] !== undefined) {
                        cssRule.style[cssProperty] = null;
                    }
                });
            }
        }
    }
})();