// ==UserScript==
// @name         Remove Entry Meta Element
// @namespace    your-namespace
// @version      1.0
// @description  Removes specified entry meta element from the page
// @match        https://cydmyz.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464234/Remove%20Entry%20Meta%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/464234/Remove%20Entry%20Meta%20Element.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const entryMeta = document.querySelector('.entry-meta');
    
    // remove entry-meta div
    entryMeta.parentNode.removeChild(entryMeta);
})();
