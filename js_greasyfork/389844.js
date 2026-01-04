// ==UserScript==
// @name         SLIVER Rainbow Theme
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Turn sliver into a abomination
// @author       Wulf715 & Salt of SLIVER
// @match        https://www.sliver.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389844/SLIVER%20Rainbow%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/389844/SLIVER%20Rainbow%20Theme.meta.js
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
addGlobalStyle(' body {background: radial-gradient(circle, red, yellow, green);} ');
addGlobalStyle(' .navbar {background: radial-gradient(circle, red, yellow, green);} ');
addGlobalStyle(' .sidebar {background: radial-gradient(circle, red, yellow, green);} ');
addGlobalStyle(' html {font-family: "Comic Sans MS";} ');
