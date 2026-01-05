// ==UserScript==
// @name         Podio card view tweak
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Small tweak to Podio CSS to improve the card view for apps to make it a bit more like Toggl
// @author       Mark Dixon
// @match        https://podio.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14461/Podio%20card%20view%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/14461/Podio%20card%20view%20tweak.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.body { white-space: normal !important; }');
addGlobalStyle('.footer { height: 0px !important; }');
addGlobalStyle('.footer { padding: 0px !important; }');
