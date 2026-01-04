// ==UserScript==
// @name AWBW: Color-Blinded-Friendly Status Icon
// @namespace https://userstyles.world/user/hollen9
// @version 20240130.19.14
// @description Make respective status icon unique shape that looks just like discord
// @author hollen9
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.amarriner.com/*
// @downloadURL https://update.greasyfork.org/scripts/486082/AWBW%3A%20Color-Blinded-Friendly%20Status%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/486082/AWBW%3A%20Color-Blinded-Friendly%20Status%20Icon.meta.js
// ==/UserScript==

(function() {
let css = `
span.dot_yellow::before {
    content: "" !important;
    height: 4px !important;
    width: 4px !important;
    border-radius: 50% !important;
    position: absolute !important;
    top: 10px !important;
    left: 12px !important;
    box-shadow: 2px 2px 0 0 #111 !important;
}


span.dot_yellow {
    height: 6px !important;
    width: 6px !important;
    background-color: yellow !important;
    border: solid 0px #000000 !important;
    border-radius: 50% !important;
    display: inline-block !important;
    box-shadow: 0px 0px 0 0.7px #111 !important;
}

span.dot_gray::before {
    content: "" !important;
    height: 4px !important;
    width: 4px !important;
    border-radius: 50% !important;
    position: absolute !important;
    top: 10px !important;
    left: 12px !important;
    box-shadow: 3px 3px 0 -0.3px #EEE !important;
}

span.dot_red::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 14px;
    width: 4px;
    height: 2px;
    background: #111;
    border-radius: 15%;
}

.player-activity-status.dot_yellow::before,
.player-activity-status.dot_gray::before,
.player-activity-status.dot_red::before{
    top: -2px !important;
    left: -2px !important;
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
