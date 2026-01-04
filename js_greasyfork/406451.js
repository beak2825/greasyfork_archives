// ==UserScript==
// @name Pendorian Legacy Font
// @namespace https://xpuls3.github.io/
// @version 1.0.1
// @author Puls3
// @include /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @icon https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/master/favicon.ico
// @grant none
// @run-at document-start
// @description Changes the new Pendoria font to the old one.
// @downloadURL https://update.greasyfork.org/scripts/406451/Pendorian%20Legacy%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/406451/Pendorian%20Legacy%20Font.meta.js
// ==/UserScript==

// This script was created by Puls3!
// - Puls3 on Pendoria

let style = `

body {
    font-family: helvetica, arial;
}

`;

window.addEventListener("DOMContentLoaded", function() {
    let element = document.createElement("style");
    element.innerText = style;
    element.classList.add("legacy-font-style");
    document.head.append(element);
});
