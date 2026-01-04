// ==UserScript==
// @name         linusakesson.net fix fonts
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  fix TTY demystified website
// @author       You
// @match        *://www.linusakesson.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docs.rs
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501000/linusakessonnet%20fix%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/501000/linusakessonnet%20fix%20fonts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const codeElements = document.querySelectorAll("div, a, ol, li, ul, p, pre, code, .font, tt");
    codeElements.forEach(element => {
        // https://stackoverflow.com/questions/38454240/using-css-important-with-javascript
        element.style = "font-family: Iosevka Term Extended";
        element.style.fontSize = "13pt";
    });

    let leftbar = document.getElementById("leftbar");
    leftbar.remove();

    let maindivElements = document.querySelectorAll("div.maindiv");
    maindivElements.forEach(element => {
        element.style.maxWidth = "100%";
    });
})();