// ==UserScript==
// @name 20020 - Satellite readability
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Improves readability of Ten, Nine, and Juice's dialogue in SBNation's 20020
// @grant GM_addStyle
// @run-at document-start
// @match https://www.sbnation.com/secret-base/21410129/20020/*
// @downloadURL https://update.greasyfork.org/scripts/412532/20020%20-%20Satellite%20readability.user.js
// @updateURL https://update.greasyfork.org/scripts/412532/20020%20-%20Satellite%20readability.meta.js
// ==/UserScript==

(function() {
let css = `
  .ten, .juice, .nine {
    line-height: 130%;
  }

  .ten span, .juice span, .nine span {
    padding: 0.1em 0.3em;
    display: block;
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
