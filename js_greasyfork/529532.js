// ==UserScript==
// @name         Autodarts - Remove AVG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the AVG in a running game
// @author       benebelter / MartinHH
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://play.autodarts.io/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529532/Autodarts%20-%20Remove%20AVG.user.js
// @updateURL https://update.greasyfork.org/scripts/529532/Autodarts%20-%20Remove%20AVG.meta.js
// ==/UserScript==

(function() {
    'use strict';
  GM_addStyle(".css-1j0bqop { visibility: hidden;}");
})();