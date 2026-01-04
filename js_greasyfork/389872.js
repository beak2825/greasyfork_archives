// ==UserScript==
// @name         SLIVER Suited Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Turn sliver into a Fancy T-Rex
// @author       Wulf715
// @match        https://www.sliver.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389872/SLIVER%20Suited%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/389872/SLIVER%20Suited%20Theme.meta.js
// ==/UserScript==

(function() {
    console.log("Rainbow Theme Active")
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

addGlobalStyle(' body {background: rgb(36, 39, 54);} ');
addGlobalStyle(' html {font-family: "Proxima Nova";} ');
addGlobalStyle(' .navbar {background: rgb(36, 39, 54);} ');
addGlobalStyle(' .sidebar {background-color: rgb(36, 39, 54);} ');