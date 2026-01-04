// ==UserScript==
// @name Archive Of Our Own - Change separator between tags
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Changes the separator between tags to something more noticeable.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/396908/Archive%20Of%20Our%20Own%20-%20Change%20separator%20between%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/396908/Archive%20Of%20Our%20Own%20-%20Change%20separator%20between%20tags.meta.js
// ==/UserScript==

(function() {
let css = `

    .commas li::after
    {
        content: " ●";
    }
    
    .commas li.last::after 
    {
        content: none !important;
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
