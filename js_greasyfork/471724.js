// ==UserScript==
// @name rule34 dark theme
// @namespace 4g9yab218390h9oea49y.xyz/ua984btah4b9
// @version 1.0.0
// @description theme for rule34 that is dark
// @author anonymous
// @license public domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*.rule34.xxx/*
// @downloadURL https://update.greasyfork.org/scripts/471724/rule34%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/471724/rule34%20dark%20theme.meta.js
// ==/UserScript==

(function() {
let css = `
/* dark background */
body {
    background: #202124 !important;
}

/* text */
body, a ,
.tag-count ,
table.form th
{
    color: #aadc96 !important;
}

/* lighter background */
div#header ul#subnavbar ,
tr.tableheader ,
thead tr ,
div#header ul#navbar li.current-page ,
table.highlightable tr:hover ,
div#paginator a:hover
{
    background: #303134 !important;
}

/* some images have inline style for blue border */
img.preview[style] {
    border: #303134 !important;
}

/* make table border consistent across high and low dpi */
table.highlightable td {
    border: 1px solid !important;
    border-color: #657f5d !important;
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
