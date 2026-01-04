// ==UserScript==
// @name         System Fonts
// @include      http*
// @locale      en
// @version      0.20
// @description  Use system default fonts across the web
// @author       Danny J Kendall (MANICX100)
// @grant        none
// @namespace https://greasyfork.org/users/169145

// @downloadURL https://update.greasyfork.org/scripts/367739/System%20Fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/367739/System%20Fonts.meta.js
// ==/UserScript==


var s = document.createElement("style");
s.type = "text/css";
s.textContent = "* { font-family: Bahnschrift, -apple-system,BlinkMacSystemFont, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, sans-serif !important; }";

document.head.appendChild(s);