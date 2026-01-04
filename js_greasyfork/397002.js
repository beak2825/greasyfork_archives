// ==UserScript==
// @name         THETA Dark Gradient Theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Turn THETA.tv into a dark themed gradient
// @author       Wulf715
// @match        https://www.theta.tv/*
// @match        https://mod.sliver.tv/*
// @match        https://dashboard.theta.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397002/THETA%20Dark%20Gradient%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/397002/THETA%20Dark%20Gradient%20Theme.meta.js
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
addGlobalStyle(' body {background: radial-gradient(circle, grey, black, grey);} ');
addGlobalStyle(' .navbar {background: radial-gradient(circle, grey, black, grey);} ');
addGlobalStyle(' .sidebar {background: radial-gradient(circle, grey, black, grey);} ');
addGlobalStyle(' html {font-family: "Proxima Nova";} ');
addGlobalStyle(' .content.inventory-page .unclaimed-inventory-content .unclaimed-inventory-list .unclaimed-inventory-item {background-color: grey;} ')
addGlobalStyle(' .content.inventory-page .unclaimed-inventory-content .unclaimed-inventory-list .unclaimed-inventory-item .name .details {color: white;}')
addGlobalStyle(' input[type="email"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="url"], input[type="color"], input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="time"], input[type="week"], textarea {background-color: grey;} ')
addGlobalStyle(' header {background: bottom;} ')
addGlobalStyle(' .g-panel .panel-content {background: bottom;} ')
addGlobalStyle(' .g-header.mobile {background-color: grey;} ')
addGlobalStyle(' .g-sidemenu {background-color: black;} ')
