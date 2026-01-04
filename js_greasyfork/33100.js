// ==UserScript==
// @name         Block adblocker warnings tweakers.net
// @namespace    https://marthijnhoiting.com/
// @author       Marthijn Hoiting
// @include      http://tweakers.net/*
// @include      https://tweakers.net/*
// @version      0.2
// @grant        none
// @license      Copyright by Marthijn Hoiting
// @run-at       document-start
// @description  Blocked warning @ tweakers.net
// @downloadURL https://update.greasyfork.org/scripts/33100/Block%20adblocker%20warnings%20tweakersnet.user.js
// @updateURL https://update.greasyfork.org/scripts/33100/Block%20adblocker%20warnings%20tweakersnet.meta.js
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

addGlobalStyle('.notificationsContainer { display: none !important; }');