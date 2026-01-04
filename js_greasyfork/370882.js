// ==UserScript==
// @name         WME Invert GSV
// @namespace    https://greasyfork.org/en/users/46070
// @version      0.1
// @description  Un-invert GSV in WME
// @author       Iain House
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/editor*
// @include      https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/*user/editor/*
// @supportURL   https://www.waze.com/forum/viewtopic.php?f=819&t=263340
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370882/WME%20Invert%20GSV.user.js
// @updateURL https://update.greasyfork.org/scripts/370882/WME%20Invert%20GSV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.gm-style { filter: invert(1) !important; }';
    style.id = "INVERTGSV";
    document.head.appendChild(style);
})();