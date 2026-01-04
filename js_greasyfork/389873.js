// ==UserScript==
// @name         SLIVER Pure Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Purelights theme
// @author       Wulf715
// @match        https://www.sliver.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389873/SLIVER%20Pure%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/389873/SLIVER%20Pure%20Theme.meta.js
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
addGlobalStyle(' body {background: rgb(255, 98, 0);} ');
addGlobalStyle(' .navbar {background: rgb(170, 0, 255);} ');
addGlobalStyle(' .sidebar {background: rgb(255, 0, 0);} ');
addGlobalStyle(' html {font-family: "Proxima Nova";} ');
