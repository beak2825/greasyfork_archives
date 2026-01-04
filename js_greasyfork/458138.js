// ==UserScript==
// @name Twitch highlight unstacker
// @namespace https://greasyfork.org/en/users/212281
// @version 1.0
// @description Make bttv play nice with twitch
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/458138/Twitch%20highlight%20unstacker.user.js
// @updateURL https://update.greasyfork.org/scripts/458138/Twitch%20highlight%20unstacker.meta.js
// ==/UserScript==

(function() {
let css = `
.community-highlight-stack__card{
    opacity: 50%;
}

#bttv-pin-container{
    z-index: 999;
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
