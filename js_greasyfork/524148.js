// ==UserScript==
// @name 2014 to Mid 2015 channel search icon for StarTube 2015 layout
// @namespace github.com/openstyles/stylus
// @version 1.0
// @description idk
// @author Gool
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/524148/2014%20to%20Mid%202015%20channel%20search%20icon%20for%20StarTube%202015%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/524148/2014%20to%20Mid%202015%20channel%20search%20icon%20for%20StarTube%202015%20layout.meta.js
// ==/UserScript==

(function() {
let css = `
[modern-styles] #channel-search .show-search img {
background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) 0 -696px;
background-size: auto;
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
