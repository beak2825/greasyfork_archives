// ==UserScript==
// @name         Avoid twitter
// @namespace    https://apap04.com
// @version      0.4.1
// @description  an easier way to block twitter.
// @author       me@apap04.com
// @match        twitter.com
// @match        developer.twitter.com
// @match        twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418666/Avoid%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/418666/Avoid%20twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var b = document.querySelector('body');
    var rroot = document.getElementById("react-root")
    var p = document.createElement('p');

    b.removeChild(rroot);
    b.style = "display: grid; justify-content: center; align-content: center; font-family: 'Roboto'; overflow: hidden; background-color: #000;"
    p.style = "color: white; font-size: 9em;"
    p.innerText = "bad site";
    b.appendChild(p);
})()