// ==UserScript==
// @name Tumblr Quick New Dash Font Fix
// @namespace https://greasyfork.org/users/662334
// @version 0.0.2
// @description Simple style that shrinks the Tumblr new dash font. Did this quick, I'm sure others have done it faster and better but wanted to throw my hat in the ring. Shrinks titles and headings like XKit Tweaks does, but that can be removed by removing everything after (and including) "h1".
// @author citrusella
// @grant GM_addStyle
// @run-at document-start
// @include https://www.tumblr.com*/*
// @downloadURL https://update.greasyfork.org/scripts/406363/Tumblr%20Quick%20New%20Dash%20Font%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/406363/Tumblr%20Quick%20New%20Dash%20Font%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
p:not(.tab_anchor_text),a,li,.LN-U6,._3t3fM {
    font-size: 14px !important;
}

h1 { /*pulled directly from xkit*/
    font-family: "Helvetica Neue", Helvetica, sans-serif !important;
    font-size: 22px !important;
    font-weight: bold !important;
    line-height: normal !important;
    min-height: 25px !important;
}

h2 { /*pulled directly from xkit*/
    font-size: 15px !important;
    line-height: normal !important;
    font-weight: bold !important;
    font-family: "Helvetica Neue", Helvetica, sans-serif !important;
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
