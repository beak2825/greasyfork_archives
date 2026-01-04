// ==UserScript==
// @name         Thin tall font
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gota.io pixel font by Prof discord is .proffi
// @author       Prof
// @match        https://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425949/Thin%20tall%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/425949/Thin%20tall%20font.meta.js
// ==/UserScript==
var fontURL = "https://dl.dropboxusercontent.com/scl/fi/aga6rvzlf1w7dabbruxfc/antonio.light.ttf?rlkey=m2dh17lx05565fgy4yyi8o08s&dl=0";

if (fontURL !== "") {
    var cssString = "@font-face {font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('" + fontURL + "')}";
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}
