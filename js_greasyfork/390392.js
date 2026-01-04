// ==UserScript==
// @name         SLIVER Turbo Theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Gotta go fast with the Turbo theme!
// @author       Wulf715
// @match        https://www.sliver.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390392/SLIVER%20Turbo%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/390392/SLIVER%20Turbo%20Theme.meta.js
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
addGlobalStyle(' body {background: radial-gradient(circle, red, orange, red);} ');
addGlobalStyle(' .navbar {background: linear-gradient(to right, orange 0%, red 100%); ');
addGlobalStyle(' .sidebar {background: linear-gradient(orange 0%, red 100%);} ');
addGlobalStyle(' html {font-family: "Proxima Nova";} ');
addGlobalStyle(' .slvr-button--green {background: linear-gradient(to right, orange 0%, red 100%); } ');
addGlobalStyle(' .page-container .side-menu {background-color: none;} ');