// ==UserScript==
// @name        five line code ,make your sourcegraph better
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the font size on sourcegraph. Current font is too small. Used code from https://somethingididnotknow.wordpress.com/2013/07/01/change-page-styles-with-greasemonkeytampermonkey/
// @author       https://github.com/daidaiJ
// @match        http*://sourcegraph.com/*
// @downloadURL https://update.greasyfork.org/scripts/473803/five%20line%20code%20%2Cmake%20your%20sourcegraph%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/473803/five%20line%20code%20%2Cmake%20your%20sourcegraph%20better.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
  // --code-font-family -> font-family
  // default is Cascadia Code
    document.documentElement.style.setProperty(`--code-font-family`, 'Cascadia Code');
    document.documentElement.style.setProperty(`--code-font-size`, '16px');
    // --font-weight-base: 400;
    document.documentElement.style.setProperty(`--font-weight-base`, 'normal');
})();

