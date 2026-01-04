// ==UserScript==
// @name         SLIVER Light Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A light theme for sliver
// @author       Wulf715
// @match        https://www.sliver.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389963/SLIVER%20Light%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/389963/SLIVER%20Light%20Theme.meta.js
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
addGlobalStyle(' body {background: #99AAB5;} ');
addGlobalStyle(' .navbar {background: #C0C0C0; ');
addGlobalStyle(' .sidebar {background: #C0C0C0;} ');
addGlobalStyle(' html {font-family: "Proxima Nova";} ');