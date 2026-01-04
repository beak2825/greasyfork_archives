// ==UserScript==
// @name Archive Of Our Own - Highlight tagset tags on hover
// @namespace https://greasyfork.org/users/3759
// @version 1.1
// @description Highlights tags in tagsets when you hover over them.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/396905/Archive%20Of%20Our%20Own%20-%20Highlight%20tagset%20tags%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/396905/Archive%20Of%20Our%20Own%20-%20Highlight%20tagset%20tags%20on%20hover.meta.js
// ==/UserScript==

(function() {
let css = `

.fandom.listbox.group .tags.index.group.commas li, .cast.listbox.group li {
        padding-right: 0;
        margin-right: 0.25em;
    }

.fandom.listbox.group .tags.index.group.commas li:hover, .cast.listbox.group li:hover {
        background: #910000 !important;
        color: #FFFFFF !important;
    }
  
/* If you're using a custom style that changes the text and background color of the site, change these values to whatever values are provided by that style. Otherwise, just leave this alone. */
.fandom.listbox.group .tags.index.group.commas li:hover::after, .cast.listbox.group li:hover::after {
    background: #FFFFFF !important;
    color: #000000;
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
