// ==UserScript==
// @name         Improved Doxygen styling
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make the text of Doxygen easier to read
// @author       Joost Visser
// @match        https://output.circle-artifacts.com/*/doxygen/*
// @match        */*/*/build/docs/html/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450832/Improved%20Doxygen%20styling.user.js
// @updateURL https://update.greasyfork.org/scripts/450832/Improved%20Doxygen%20styling.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let maxWidth = "55em";

    let doc = document.querySelector("#doc-content");
    let header = document.querySelector(".header");
    let contents = document.querySelector(".contents");

    doc.style.display = "flex";
    doc.style.alignItems = "start";
    doc.style.flexDirection = "column";

    header.style.width = "100%";
    header.style.maxWidth = maxWidth;

    contents.style.width = "100%";
    contents.style.maxWidth = maxWidth;

})();