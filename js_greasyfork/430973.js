// ==UserScript==
// @name YouTube classic Seek UI
// @namespace jkrosado.github.io
// @version 1.0
// @description Replicates the Seek UI from 2016-2021.
// @author «John»
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/430973/YouTube%20classic%20Seek%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/430973/YouTube%20classic%20Seek%20UI.meta.js
// ==/UserScript==

(function() {
let css = `
/* created by »John»#1234 to restore the classic seek UI */
.ytp-doubletap-seek-info-container {
    background: rgba(0,0,0,0.6);
    width: 52px!important;
    height: 52px!important;
    border-radius: 100%;
}
.ytp-doubletap-base-arrow {
    border: 7px solid transparent;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
}
.ytp-doubletap-seek-info-container {
    display: flex;
    justify-content: center;
}
.ytp-doubletap-tooltip {
    display: none;
}
.ytp-doubletap-arrows-container {
    width: 35px!important;
}
.ytp-doubletap-static-circle {
    display: none!important;
}
.ytp-doubletap-ui-legacy[data-side=forward] .ytp-doubletap-base-arrow {
    border-left: 7px solid #ddd!important;
}
.ytp-doubletap-ui-legacy[data-side=back] .ytp-doubletap-base-arrow {
    border-right: 7px solid #ddd!important;
}
.ytp-doubletap-arrows-container {
    width: 52px!important;
    height: 52px!important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ytp-doubletap-static-circle, .ytp-doubletap-seek-info-container {
    width: 52px!important;
    height: 52px!important;
    animation: ytp-bezel-fadeout .5s linear 1 normal forwards;
    animation-duration: 0.5s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;
    animation-name: ytp-bezel-fadeout;
}
.ytp-doubletap-seek-info-container {
    left: initial!Important;
}
.ytp-doubletap-ui-legacy {
    display: flex;
    justify-content: center;
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
