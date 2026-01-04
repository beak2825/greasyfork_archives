// ==UserScript==
// @name         Change default font-family for <code> at Gorm.io Website
// @namespace    https://gorm.io/docs/
// @version      0.1
// @description  Sets the font-family and font-size attributes for code blocks within gorm.io website. 
// @author       Venkatt Guhesan
// @match        https://gorm.io/docs/*
// @icon         https://www.google.com/s2/favicons?domain=gorm.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438690/Change%20default%20font-family%20for%20%3Ccode%3E%20at%20Gormio%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/438690/Change%20default%20font-family%20for%20%3Ccode%3E%20at%20Gormio%20Website.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
    'use strict';

    addGlobalStyle('.line { font-family: Consolas, Monaco, \'Andale Mono\', \'Ubuntu Mono\', monospace !important; font-size: 20px !important; }');

})();

