// ==UserScript==
// @name VK.com Without Limit v.2.0
// @namespace https://greasyfork.org/en/users/8-decembre?sort=updated
// @version 2.00
// @description Bypass the need to login to use VK.com
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/441310/VKcom%20Without%20Limit%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/441310/VKcom%20Without%20Limit%20v20.meta.js
// ==/UserScript==

(function() {
let css = `
/* === VK.com Without Limit v.2.0  === */

/* SUPP */
#page_bottom_banners_root ,
.scroll_fix_wrap #box_layer ,

#layer_wrap.scroll_fix_wrap.fixed.layer_wrap ,
[dir] #box_layer_bg ,
.popup_box_container.UnauthActionBoxContainer.UnauthActionBoxContainer--form{
  display: none !important;
}

/* NO LIMIT */
.anonym.anonym_nav.redesign_web.layers_shown ,
.anonym.anonym_nav.new_header_design.layers_shown{
    overflow: visible !important;
}
#box_layer_wrap {
    z-index: 0 !important;
}
 
 
/* === END  ==== */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
