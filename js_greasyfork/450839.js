// ==UserScript==
// @name         American Thinker Centerer
// @namespace    Amaroq64
// @version      0.2
// @description  Center the American Thinker webpage.
// @author       Amaroq
// @match        https://www.americanthinker.com/*
// @icon         https://www.americanthinker.com/favicon.ico
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/450839/American%20Thinker%20Centerer.user.js
// @updateURL https://update.greasyfork.org/scripts/450839/American%20Thinker%20Centerer.meta.js
// ==/UserScript==

var newStyleSheet = document.createElement("style");
newStyleSheet.type = "text/css";
newStyleSheet.innerText = "#wrapper {margin: 10px auto; width: 1005px}";
document.head.appendChild(newStyleSheet);