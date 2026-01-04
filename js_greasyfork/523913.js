// ==UserScript==
// @name         X live header remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes header from X if you open it on desktop to expand live area
// @author       Szabolcs Berényi
// @match        https://x.com/i/broadcasts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523913/X%20live%20header%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/523913/X%20live%20header%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var header = document.querySelector('header');
        if (header) {
            header.parentNode.removeChild(header);
        }
    };
})();