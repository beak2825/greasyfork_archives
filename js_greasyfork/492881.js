// ==UserScript==
// @name         Roblox Gotham Font Changer
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Change the font on Roblox to Gotham
// @author       verticalfx
// @match        *://*.roblox.com/*
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492881/Roblox%20Gotham%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/492881/Roblox%20Gotham%20Font%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // there is a variation between Gotham and Gotham SSm. I haven't been able to find an identical copy of the font with similar font weights that match.
    // I would have self hosted but it goes against their terms of use. Best I can do for now.

    var fontFaces = `
    @font-face{font-family:'Gotham';font-style:normal;font-weight:400;src:local('Gotham'),url(https://fonts.cdnfonts.com/s/14898/GothamBook.woff) format('woff')}
    @font-face{font-family:'Gotham';font-style:italic;font-weight:400;src:local('Gotham'),url(https://fonts.cdnfonts.com/s/14898/GothamBookItalic.woff) format('woff')}
    @font-face{font-family:'Gotham';font-style:normal;font-weight:300;src:local('Gotham'),url(https://fonts.cdnfonts.com/s/14898/GothamLight.woff) format('woff')}
    @font-face{font-family:'Gotham';font-style:italic;font-weight:300;src:local('Gotham'),url(https://fonts.cdnfonts.com/s/14898/GothamLightItalic.woff) format('woff')}
    @font-face{font-family:'Gotham';font-style:normal;font-weight:500;src:local('Gotham'),url(https://fonts.cdnfonts.com/s/14898/GothamMedium.woff) format('woff')}
    @font-face{font-family:'Gotham';font-style:italic;font-weight:500;src:local('Gotham'),url(https://fonts.cdnfonts.com/s/14898/GothamMediumItalic.woff) format('woff')}
    @font-face{font-family:'Gotham';font-style:normal;font-weight:700;src:local('Gotham'),url(https://fonts.cdnfonts.com/s/14898/GothamBold.woff) format('woff')}
    @font-face{font-family:'Gotham';font-style:italic;font-weight:700;src:local('Gotham'),url(https://fonts.cdnfonts.com/s/14898/GothamBoldItalic.woff) format('woff')}
    `;

    // Apply Gotham as the primary font family with 'HCo Gotham SSm' as fallback
    var css = `* { font-family:  'HCo Gotham SSm', 'Gotham' !important; }`;

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(fontFaces + css));
})();
