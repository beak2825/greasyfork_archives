// ==UserScript==
// @name Pendoria - Hide Moving Chat Titles
// @namespace http://pendoria.net/
// @version 1.0.1
// @author Puls3
// @include /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @icon https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/master/favicon.ico
// @grant none
// @run-at document-start
// @description Hides moving titles for accessibility.
// @downloadURL https://update.greasyfork.org/scripts/440653/Pendoria%20-%20Hide%20Moving%20Chat%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/440653/Pendoria%20-%20Hide%20Moving%20Chat%20Titles.meta.js
// ==/UserScript==

// This script was created by Puls3!
// - Puls3 on Pendoria

window.addEventListener("DOMContentLoaded", () => {
    initiate();
})

function initiate() {

    const styleElement = document.createElement("style");
  
    styleElement.innerText =
      "#chat marquee { display: none!important; }" +
      "#gameframe-content marquee { display: none!important; }";

    document.head.append(styleElement);

}