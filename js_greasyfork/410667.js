// ==UserScript==
// @name         Steam review visibility fix
// @version      0.1
// @description  fix steam review invisible problem temporary
// @author       Allenz
// @match        https://store.steampowered.com/app/*
// @namespace https://greasyfork.org/users/684654
// @downloadURL https://update.greasyfork.org/scripts/410667/Steam%20review%20visibility%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/410667/Steam%20review%20visibility%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    addGlobalStyle('.filtered_text { visibility:visible !important; }');
})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}