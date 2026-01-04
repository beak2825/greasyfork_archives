// ==UserScript==
// @name         Sessionize anonymizer
// @namespace    http://tampermonkey.net/
// @version      2024-08-16
// @license      Apache 2.0
// @description  Hide speaker info in Sessionize until hovered
// @author       Sebastiano Poggi
// @match        https://sessionize.com/app/organizer/event/evaluation/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sessionize.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503832/Sessionize%20anonymizer.user.js
// @updateURL https://update.greasyfork.org/scripts/503832/Sessionize%20anonymizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elems = document.querySelectorAll("div.es-speakers > div.social-feed-box");
    var css = 'div.es-speakers > div.social-feed-box {\nfilter: blur(10px);\n     transition: filter .15s ease .05s;\n}\n\ndiv.es-speakers > div:hover.social-feed-box { filter: none };';
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName('head')[0].appendChild(style);
})();