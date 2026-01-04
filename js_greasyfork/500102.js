// ==UserScript==
// @name GNU Pascal Cringe Removal
// @namespace https://greasyfork.org/users/1330715
// @version 1.0
// @description Removes ocular assault from the GNU Pascal website.
// @author base2taiji
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/500102/GNU%20Pascal%20Cringe%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/500102/GNU%20Pascal%20Cringe%20Removal.meta.js
// ==/UserScript==

(function() {
let css = `body, td {
    background: none #000;
    color: #fff;
}

img[alt="[Gnu and Blaise Pascal]"] {
    filter: invert(1);
}

a {
    color: skyblue;
}

a:hover {
    color: deepskyblue;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
