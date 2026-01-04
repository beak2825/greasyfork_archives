// ==UserScript==
// @name         HBO Player Fill Window
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://play.hbogo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397310/HBO%20Player%20Fill%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/397310/HBO%20Player%20Fill%20Window.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'video { width: 100vw !important; height: 100vh !important; position: fixed !important; top: -40px !important; left: -5px !important; z-index: 100000001 !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);
})();