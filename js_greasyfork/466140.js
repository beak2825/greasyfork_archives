// ==UserScript==
// @name         V2exWidescreen
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  remove max-width: 1100px;
// @author       You
// @match        https://*.v2ex.com/*
// @match        https://v2ex.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466140/V2exWidescreen.user.js
// @updateURL https://update.greasyfork.org/scripts/466140/V2exWidescreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = `
        #Wrapper > .content.content,
        #Wrapper > .content {
            min-width: 600px !important;
            max-width: 100% !important;
            width: unset !important;
            height: unset !important;
            margin: 0 auto !important;
        }
    `;
    let styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    if(styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css;
    } else {
        styleElement.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(styleElement);
})();