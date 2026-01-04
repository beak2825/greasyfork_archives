// ==UserScript==
// @name         Wikipedia Preview User Script
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Shows article preview popup on hovering Wikipedia links, using Wikipedia Preview (https://www.mediawiki.org/wiki/Wikipedia_Preview)
// @author       Diego de la Hera
// @match        *://*/*
// @exclude      *://*.wikipedia.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466770/Wikipedia%20Preview%20User%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/466770/Wikipedia%20Preview%20User%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptElem = document.createElement("script");
    scriptElem.setAttribute("src", "https://unpkg.com/wikipedia-preview/dist/wikipedia-preview.production.js");
    document.body.appendChild(scriptElem);
    scriptElem.onload = () => {
        wikipediaPreview.init({
            root: document,
            detectLinks: true
        });
    };

})();