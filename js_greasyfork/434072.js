// ==UserScript==
// @name Quora.com Without Limit v.5
// @namespace https://greasyfork.org/en/users/8-decembre?sort=updated
// @version 5.00
// @description Bypass the need to login to use Quora.com
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.quora.com/*
// @downloadURL https://update.greasyfork.org/scripts/434072/Quoracom%20Without%20Limit%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/434072/Quoracom%20Without%20Limit%20v5.meta.js
// ==/UserScript==

(function() {
let css = `
 
/* ==== 0- Quora.com Without Limit v.5  ==== */


/* (new3) USER SELECT */
html {
    -moz-user-select: text !important;
    -webkit-user-select: text !important;
    -ms-user-select: text !important;
/*     user-select: text !important; */
}

/* SUPP PROTECTION */
.q-click-wrapper.qu-mr--small.qu-borderRadius--pill.qu-alignItems--center.qu-justifyContent--center.qu-whiteSpace--nowrap.qu-userSelect--none.qu-display--inline-flex.qu-tapHighlight--white.qu-textAlign--center.qu-cursor--pointer.ClickWrapper___StyledClickWrapperBox-zoqi4f-0.iyYUZT.base___StyledClickWrapper-lx6eke-1.fjrnbr ,
.qu-full ,
.q-absolute.qu-full.qu-bg--blue ,
.q-flex.qu-alignItems--flex-end.qu-justifyContent--center.qu-overflow--hidden.qu-zIndex--blocking_wall.qu-p--medium ,
#modal_page_wrapper ,
.q-flex.qu-alignItems--center.qu-justifyContent--center.qu-overflow--hidden.qu-zIndex--blocking_wall {
    display: none !important;
}
.q-fixed.qu-alignItems--center.qu-top--huge.qu-left--small.qu-right--small.qu-display--flex.qu-flexDirection--column{
display: none !important;
}
 
.q-box ,
.q-box.qu-overflow--hidden ,
.signup_wall_prevent_scroll #root {
    filter: none !important;
}
.q-fixed.qu-fullX {
    position: absolute !important;
}
.signup_wall_prevent_scroll .q-box .q-fixed + .q-flex {
    display: none !important;
}
div[id$="_signup_wall_wrapper"] {
    display: none !important;
}
.q-platform--mobile ,
.q-flex.qu-alignItems--center.qu-justifyContent--center.qu-overflow--hidden.qu-zIndex--blocking_wall + .q-box.qu-overflow--hidden {
    overflow: visible !important;
}

/* (new4) */
body.q-platform--desktop {
    overflow: visible !important;
}

/* ==== END === */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
