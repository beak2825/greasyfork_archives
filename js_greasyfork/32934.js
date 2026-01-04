// ==UserScript==
// @name         Smaller Coursera Subtitle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reduce size of coursera subtitle on high dpi screen
// @author       zsefvlol
// @include      http://www.coursera.org/*
// @include      https://www.coursera.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32934/Smaller%20Coursera%20Subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/32934/Smaller%20Coursera%20Subtitle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = 'video::-webkit-media-text-track-display {font-size: 50%;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
})();