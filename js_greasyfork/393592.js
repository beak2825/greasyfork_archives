// ==UserScript==
// @name         Always On Video For kissanime.ru
// @version      0.1
// @description  Make kissanime.ru always show the video stream
// @author       Sined_121
// @match        https://kissanime.ru/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/393592/Always%20On%20Video%20For%20kissanimeru.user.js
// @updateURL https://update.greasyfork.org/scripts/393592/Always%20On%20Video%20For%20kissanimeru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("divContentVideo").style.display = "inline";
})();