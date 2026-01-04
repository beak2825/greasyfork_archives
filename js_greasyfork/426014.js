// ==UserScript==
// @name Compact FA Submissions layout with floating removal bar
// @namespace https://greasyfork.org/en/users/703495
// @version 0.1
// @description makes the page nicer to use
// @author @YR Foxtaur
// @license CC-BY 4.0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.furaffinity.net/msg/submissions/*
// @downloadURL https://update.greasyfork.org/scripts/426014/Compact%20FA%20Submissions%20layout%20with%20floating%20removal%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/426014/Compact%20FA%20Submissions%20layout%20with%20floating%20removal%20bar.meta.js
// ==/UserScript==

(function() {
let css = `
body{
    overflow-x:visible;
}

div#standardpage section:last-child{
    position:sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
}
h4.date-divider{
    display: inline-block;
    width:min-content;
    height:21px;
    padding:3em 0;
    white-space:break-spaces;
}
div#messagecenter-submissions{
    text-align:center;
}
section.gallery{
    display:inline;
    text-align:center;
    white-space:nowrap;
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
