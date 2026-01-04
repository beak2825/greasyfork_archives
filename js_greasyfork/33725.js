// ==UserScript==
// @name         Sam's Cure for Greyscale
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a cure for Ser Jorah Mormont!
// @author       Samwell FTRNX Tarly
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33725/Sam%27s%20Cure%20for%20Greyscale.user.js
// @updateURL https://update.greasyfork.org/scripts/33725/Sam%27s%20Cure%20for%20Greyscale.meta.js
// ==/UserScript==

(function() {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = "html, body, header, #header, footer, #footer { filter : none !important; }";
    document.body.appendChild(css);
})();