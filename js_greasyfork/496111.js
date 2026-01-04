// ==UserScript==
// @name AnomalyDB
// @namespace http://tampermonkey.net/
// @version 0.1.5
// @description AnomalyDB enhancement
// @author firetree
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.anomalydb.com/*
// @downloadURL https://update.greasyfork.org/scripts/496111/AnomalyDB.user.js
// @updateURL https://update.greasyfork.org/scripts/496111/AnomalyDB.meta.js
// ==/UserScript==

(function() {
let css = `
    :root > body {
        --tw-text-opacity: 1;
        color: rgb(156 163 175/var(--tw-text-opacity));
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
