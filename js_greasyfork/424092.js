// ==UserScript==
// @name         Imgur fit video size 100%
// @namespace    DQampire
// @version      1.0
// @description  Videos will fill the avaiable viewport.
// @author       DQampire
// @grant        GM_addStyle
// @include https://i.imgur.com/*
// @include http://i.imgur.com/*
// @downloadURL https://update.greasyfork.org/scripts/424092/Imgur%20fit%20video%20size%20100%25.user.js
// @updateURL https://update.greasyfork.org/scripts/424092/Imgur%20fit%20video%20size%20100%25.meta.js
// ==/UserScript==

(function() {
let css = `
  #content, #content video {
    height: 100vh !important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();