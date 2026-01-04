// ==UserScript==
// @name         Fix urbit docs styles
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fix codeblocks!
// @author       pfych (https://github.com/Puffycheeses)
// @match        https://urbit.org/*
// @icon         https://www.google.com/s2/favicons?domain=urbit.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432869/Fix%20urbit%20docs%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/432869/Fix%20urbit%20docs%20styles.meta.js
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

(function() {
    'use strict';

    // Make scrolling full width
    addGlobalStyle('div.min-w-0:nth-child(1) { max-width: 70ch !important; margin-right: 2em !important; }')
    addGlobalStyle('.max-w-screen-xl { max-width: unset !important; }')

    // Make codeblocks format correctly
    addGlobalStyle('pre { display: flex; }')
    addGlobalStyle('pre code { flex: 1 1 auto; padding: 1ch !important; }')
})();