// ==UserScript==
// @name Slengpung.com Pictures adjusted to screen
// @namespace https://greasyfork.org/users/676264
// @version 0.0.1.20200814212818
// @description Resizes the pictures that are too big, and fit them to the screen width.
// @author V1rgul (https://github.com/V1rgul)
// @grant GM_addStyle
// @run-at document-start
// @match http://www.slengpung.com/v3/show_photo.php*
// @downloadURL https://update.greasyfork.org/scripts/408757/Slengpungcom%20Pictures%20adjusted%20to%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/408757/Slengpungcom%20Pictures%20adjusted%20to%20screen.meta.js
// ==/UserScript==

(function() {
let css = `
html,
body,
body > table {
    width: 100%;
}

body > table {
    width: 100% !important;
}
body > br {
    display: none;
}

body > table > tbody > tr:nth-child(2) > td > img {
    max-width: 100%;
    width: auto !important;
    height: auto !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
