// ==UserScript==
// @name         THETA Doct0r Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Turn THETA.tv into a Doctor, Not a real one, But one with a PHD in badassery.
// @author       Wulf715
// @match        https://www.theta.tv/*
// @match        https://mod.sliver.tv/*
// @match        https://dashboard.theta.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399447/THETA%20Doct0r%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/399447/THETA%20Doct0r%20Theme.meta.js
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
addGlobalStyle(' body {background: radial-gradient(circle, red, blue, red);} ');
addGlobalStyle(' .navbar {background: radial-gradient(circle, red, blue, red);} ');
addGlobalStyle(' .sidebar {background: radial-gradient(circle, red, blue, red);} ');
addGlobalStyle(' html {font-family: "Proxima Nova";} ');
addGlobalStyle(' .content.inventory-page .unclaimed-inventory-content .unclaimed-inventory-list .unclaimed-inventory-item {background-color: white;} ')
addGlobalStyle(' .content.inventory-page .unclaimed-inventory-content .unclaimed-inventory-list .unclaimed-inventory-item .name .details {color: black;}')
addGlobalStyle(' input[type="email"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="url"], input[type="color"], input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="time"], input[type="week"], textarea {background-color: white;} ')
addGlobalStyle(' header {background: bottom;} ')
addGlobalStyle(' .g-panel .panel-content {background: bottom;} ')
addGlobalStyle(' .g-header.mobile {background-color: blue;} ')
addGlobalStyle(' .g-sidemenu {background-color: ;} ')