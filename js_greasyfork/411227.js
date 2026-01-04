// ==UserScript==
// @name Pickle.Finance Dill Edition (Lite)
// @namespace https://greasyfork.org/users/517035
// @version 0.0.3
// @description This is the Pickle Dill edition for Pickle.Finance (Lite)
// @author zirs3d
// @license CC0-1.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.pickle.finance/*
// @downloadURL https://update.greasyfork.org/scripts/411227/PickleFinance%20Dill%20Edition%20%28Lite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411227/PickleFinance%20Dill%20Edition%20%28Lite%29.meta.js
// ==/UserScript==

(function() {
let css = `
canvas.tsparticles-canvas-el {
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
