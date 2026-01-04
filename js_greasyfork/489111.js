// ==UserScript==
// @name swgalaxymap.com maximized map
// @namespace https://greasyfork.org/users/707341
// @version r1
// @description Maximize map over entire window (100% width and 100% height)
// @author coth
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.swgalaxymap.com/*
// @match https://hbernberg.carto.com/builder/6650a85d-b115-4680-ab97-721bf8a41a90/embed*
// @downloadURL https://update.greasyfork.org/scripts/489111/swgalaxymapcom%20maximized%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/489111/swgalaxymapcom%20maximized%20map.meta.js
// ==/UserScript==

(function() {
let css = `
div.m_iframe {
  display: block !important;
  position: fixed !important;
  top: 0px !important;
  left: 0px !important;
  width: 100vw !important;
  height: 100vh !important;
}

div.m_iframe > iframe {
  height: 100vh !important;
}

.CDB-Embed-tab {
  padding: 0px !important;
}

.CDB-Dashboard-canvas {
  background: black !important;
}

.btn-container > .kofi-button {
  display: none !important;
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
