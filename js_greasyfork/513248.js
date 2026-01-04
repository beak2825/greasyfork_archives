// ==UserScript==
// @name Remove scaling container meant for 2014-esque Roblox by melongirl
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Remove scaling container code is by Vue2016 https://userstyles.world/user/Vue2016
// @author Vue2016
// @grant GM_addStyle
// @run-at document-start
// @match https://www.roblox.com/my/avatar*
// @downloadURL https://update.greasyfork.org/scripts/513248/Remove%20scaling%20container%20meant%20for%202014-esque%20Roblox%20by%20melongirl.user.js
// @updateURL https://update.greasyfork.org/scripts/513248/Remove%20scaling%20container%20meant%20for%202014-esque%20Roblox%20by%20melongirl.meta.js
// ==/UserScript==

(function() {
let css = `
        
    
    .left-wrapper  .scale-container {
        display: none;
    }
    
    
    .left-wrapper .section-sliders {
        height: -9999px;
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
