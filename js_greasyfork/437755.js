// ==UserScript==
// @name Another One Universal Dark Theme(User Style)
// @namespace -
// @version 0.2
// @description changes all web-site theme to dark
// @author NotYou
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/437755/Another%20One%20Universal%20Dark%20Theme%28User%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437755/Another%20One%20Universal%20Dark%20Theme%28User%20Style%29.meta.js
// ==/UserScript==

(function() {
let css = `/*

﹀ Change Log ﹀

0.2 Verison:
- Greasy Fork Styles
- Added Selection Style
- Better *CONTENT* CSS

*/

/* GREASY FORK */

.text-content ,#main-header, #user-script-list, #user-deleted-script-list, .list-option-group ul, .list-option-group a:focus, .list-option-group a:hover {
box-shadow: rgb(15, 15, 15) 0px 0px 5px !important;
border: 1px solid rgb(19, 19, 19) !important;
background: rgb(22, 22, 22) !important;
}

.list-option {
background: rgb(22, 22, 22) !important;
}

.script-list li:not(.ad-entry) {
border-bottom: 1px solid rgb(36, 36, 36);
}

.badge-css {
background-color: rgb(37, 75, 221);
color: rgb(255, 255, 255) !important;
}

.badge-js {
background-color: rgb(239, 216, 29);
color: rgb(0, 0, 0) !important;
}

/* MAIN */
html, body {
background: rgb(19, 19, 19) !important;
}

::selection {
background: rgba(0, 0, 0, 0.6) !important;
color: rgb(191, 191, 191) !important;
}

/* HEADING */
header, #header, .header, nav, .nav, .navbar, .navigation {
background: rgb(22, 22, 22) !important;
}

/* CONTENT */
input, output, label, button, form, textarea, fieldset, select, option {
box-shadow: rgb(15, 15, 15) 0px 0px 5px !important;
border: 1px solid rgb(24, 24, 24 ) !important;
background-color: rgb(20, 20, 20) !important;
color: rgb(181, 181, 181) !important;
border-radius: 2px;
}

code {
background-color: rgb(19, 19, 19) !important;
}

#content, .content, h1, h2, h3, h4, h5, h6, span, sub, sup, i, b, u, s, q, dl, dd, dt, em, ol, li, ul, table, tbody, thead, tr, th, pre, div, detials, summary, main, small, big, strong, time {
color: rgb(164, 139, 139) !important;
}

div, li, ul, ol {
background-color: rgb(22, 22, 22) !important;
}

p {
color: rgb(181, 181, 181) !important;
}

a {
color: rgb(52, 116, 172) !important;
}

a:visited {
color: rgb(58, 136, 204) !important;
}

svg {
fill: rgb(191, 191, 191) !important;
}

img {
border-radius: 2px;
}

tr, td {
background-color: rgb(40, 40, 40)!important;
}

/* FOOTER */
footer, #footer, .footer {
background-color: rgb(22, 22, 22) !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
