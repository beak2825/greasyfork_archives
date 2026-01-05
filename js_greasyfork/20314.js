// ==UserScript==
// @name         Block adblocker warnings De Telegraaf
// @namespace    https://marthijnhoiting.com/
// @author       Marthijn Hoiting
// @include      http://*.telegraaf.nl/*
// @version      0.2
// @grant        none
// @license      Copyright by Marthijn Hoiting
// @run-at       document-start
// @description  Blocked warning @ De Telegraaf
// @downloadURL https://update.greasyfork.org/scripts/20314/Block%20adblocker%20warnings%20De%20Telegraaf.user.js
// @updateURL https://update.greasyfork.org/scripts/20314/Block%20adblocker%20warnings%20De%20Telegraaf.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.popup-content { display: none !important; }');
