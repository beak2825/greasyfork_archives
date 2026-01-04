// ==UserScript==
// @name         GameSense 2.1
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  GameSense 2.1 - Enhanced UI for GameSense Forums
// @author       Nado
// @license      MIT
// @match        https://gamesense.pub/forums/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://update.greasyfork.org/scripts/518265/1602254/%5BLibrary%5D%20-%20GS%20ENCH.js
// @supportURL   https://greasyfork.org/scripts/518384
// @homepageURL  https://greasyfork.org/scripts/518384
// @downloadURL https://update.greasyfork.org/scripts/518384/GameSense%2021.user.js
// @updateURL https://update.greasyfork.org/scripts/518384/GameSense%2021.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    if (!window.GSEnhancedUIInstance) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => new GSEnhancedUI());
        } else {
            new GSEnhancedUI();
        }
    }
})();