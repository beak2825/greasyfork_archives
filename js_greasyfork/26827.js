// ==UserScript==
// @name         TeamSupport Zoom
// @namespace    https://greasyfork.org/en/scripts/26827-teamsupport-zoom
// @version      0.1
// @description  Allow zoom out on TeamSupport without breaking tabs
// @author       Sean Creasy
// @match        https://app.teamsupport.com/*
// @locale       English (en)
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26827/TeamSupport%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/26827/TeamSupport%20Zoom.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.main-tabs { position: absolute !important; }');