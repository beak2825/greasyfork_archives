// ==UserScript==
// @name nautiljon-forum-index-pages-align-right
// @namespace github.com/openstyles/stylus
// @version 0.1
// @description Dans le forum, aligne à droite l'index des pages situé sous le sujet pour plus de lisibilité.
// @author Ed38
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nautiljon.com/*
// @downloadURL https://update.greasyfork.org/scripts/448578/nautiljon-forum-index-pages-align-right.user.js
// @updateURL https://update.greasyfork.org/scripts/448578/nautiljon-forum-index-pages-align-right.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insérer le code ici... */
    span.topic_pages {
        text-align: right !important;
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
