// ==UserScript==
// @name         TypeScript Width Fix
// @namespace    https://www.typescriptlang.org
// @version      v1.3
// @description  Fix the damn width in typescript docs.
// @author       erucix
// @match        https://www.typescriptlang.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typescriptlang.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525323/TypeScript%20Width%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/525323/TypeScript%20Width%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        let style = document.createElement("style");
        style.innerHTML = `.whitespace.raised{width: -webkit-fill-available;}`;
        document.head.appendChild(style);
    }
})();