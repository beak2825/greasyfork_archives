// ==UserScript==
// @name Reddit Preview Button Fix
// @namespace github.com/openstyles/stylus
// @version 1.1.0
// @description Some custom CSS on old.reddit.com causes the expand button to glitch out (where there's supposed to be a button, there's a gibberish image instead). This style fixes this by replacing the buttons with new button images from the Silk icon set. (https://commons.wikimedia.org/wiki/Silk_icons)
// @author pythoncoder42
// @grant GM_addStyle
// @run-at document-start
// @match *://*.old.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/427131/Reddit%20Preview%20Button%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/427131/Reddit%20Preview%20Button%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
    [class~=expando-button][class~=collapsed] {
        content: url('https://upload.wikimedia.org/wikipedia/commons/a/a7/Add.png') !important;
        background-image: none !important;
        transform: rotate(0deg) !important;
    }
    [class~=expando-button][class~=expanded] {
        content: url('https://upload.wikimedia.org/wikipedia/commons/5/54/Delete-silk.png') !important;
        background-image: none !important;
        transform: rotate(0deg) !important;
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
