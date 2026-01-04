// ==UserScript==
// @name         temar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403727/temar.user.js
// @updateURL https://update.greasyfork.org/scripts/403727/temar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
window.useTheme = true;
window.UIList.push({
    level: 3,
    x: 3,
    html: '<div id="Theme" onclick=theme()>White Theme</div>'
});
window.theme = function () {
    var el = document.getElementById('Theme');
    if (useTheme) {
        useTheme = false
    backgroundColor = "#ebebeb",
        outerColor="#d6d6d6"
    indicatorColor =
    "rgba(0,0,0,0.08)",
    turretColor = "#A8A8A8",
    bulletColor = "#A8A8A8",
    redColor = "rgba(255, 0, 0, 0.1)",
    el.textContent = 'White Theme'
    } else {
        useTheme = true;
    backgroundColor = "#000000",
    outerColor = "#00000a",
    indicatorColor = "#f2d00c",
    "rgba(169,168,168)",
    turretColor = "#A8A8A8",
    bulletColor = "#A8A8A8",
    redColor = "rgba(255, 7, 7, 7)",
    el.textContent = 'Dark Theme';
        populate();
    }
    window.statusBar();
    return useTheme;
}

