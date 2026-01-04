// ==UserScript==
// @name         TTX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  aa
// @author       none
// @match        https://course.taotaoxi.net/programs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taotaoxi.net
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512814/TTX.user.js
// @updateURL https://update.greasyfork.org/scripts/512814/TTX.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'SCRIPT' && node.src.includes('js/main')) {
                     node.src = 'https://8f4967eb53dd774262aa5f3311c0d3d4.github.io/main.chunk.js';
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();