// ==UserScript==
// @name         Disable Laggy Battle.net Forum Scroll Handler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Battle.net Forum scrolling performance penalty
// @author       github.com/blaenk
// @match        https://us.battle.net/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26303/Disable%20Laggy%20Battlenet%20Forum%20Scroll%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/26303/Disable%20Laggy%20Battlenet%20Forum%20Scroll%20Handler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(window).unbind('scroll');
})();