// ==UserScript==
// @name         Mine-Craft.io Mini-Map Remover Mine-Craft.io - Mine-Craft.fun
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Completely removes the mini-map in Mine-Craft.io/fun from the game.
// @author       Junes
// @match        https://mine-craft.io/*
// @match        https://mine-craft.fun/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513224/Mine-Craftio%20Mini-Map%20Remover%20Mine-Craftio%20-%20Mine-Craftfun.user.js
// @updateURL https://update.greasyfork.org/scripts/513224/Mine-Craftio%20Mini-Map%20Remover%20Mine-Craftio%20-%20Mine-Craftfun.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeMiniMap() {
        var miniMap = document.querySelector('.mini-map-container');
        if (miniMap) {
            miniMap.remove();
        }
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function() {
            removeMiniMap();
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();