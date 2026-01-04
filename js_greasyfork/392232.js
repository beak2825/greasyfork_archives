// ==UserScript==
// @name         Block adblocker warnings
// @namespace    https://marthijnhoiting.com/
// @author       Marthijn Hoiting
// @include      https://*.nu.nl/*
// @version      0.1
// @grant        none
// @license      Copyright by Marthijn Hoiting
// @run-at       document-start
// @description  Blocked warning @ NU.NL
// @downloadURL https://update.greasyfork.org/scripts/392232/Block%20adblocker%20warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/392232/Block%20adblocker%20warnings.meta.js
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

addGlobalStyle('.block.toast.adblocker { display: none !important; }');
