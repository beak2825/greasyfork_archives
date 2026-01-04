// ==UserScript==
// @name          Waze Forum Post Enlarger
// @namespace     https://greasyfork.org/en/users/46070
// @version       0.1
// @description   Enlarge fonts for legibility
// @author        Iain House
// @match         https://www.waze.com/forum/*
// @grant         none
// @supportURL    https://www.waze.com/forum/viewtopic.php?f=819&t=279545
// @downloadURL https://update.greasyfork.org/scripts/380957/Waze%20Forum%20Post%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/380957/Waze%20Forum%20Post%20Enlarger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var head, style;
    head = document.getElementsByTagName('head')[0];
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.content {font-size:15px !important;}';
    style.id = "IainHack";
    head.appendChild(style);
})();