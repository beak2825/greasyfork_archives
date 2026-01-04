// ==UserScript==
// @name         ouo.io
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Skip button automatycally
// @author       You
// @match        https://ouo.io/*
// @match        https://ouo.press/*
// @match        https://oko.sh/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412607/ouoio.user.js
// @updateURL https://update.greasyfork.org/scripts/412607/ouoio.meta.js
// ==/UserScript==

(function() {
'use strict';

document.getElementById("btn-main").click();
})();