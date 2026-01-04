// ==UserScript==
// @name Ungay Global
// @namespace url(http://www.w3.org/1999/xhtml);
// @version 1.0.2
// @description Ungay the web
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/396870/Ungay%20Global.user.js
// @updateURL https://update.greasyfork.org/scripts/396870/Ungay%20Global.meta.js
// ==/UserScript==

(function() {
let css = `.js-consent-banner,
div.loader-mask,
#cliSettingsPopup,
#af-preloader,
.social-icon,
#dpsp-floating-sidebar,
#mobile-site-navigation,
*[id^="cookie-law"],
div.item-sharings,
.mnmd-offcanvas *,
.js-mnmd-offcanvas,
#mnmd-offcanvas-primary,
.jeg_mobile_wrapper,
.js-dismissable-hero,
#openid-buttons,
*[id*="consent-banner"],
nav.menu,
#nav-drawer,
.pushy,
nav[class*=o-nav_drawer],
.o-nav_drawer,
.facebook, .twitter, .gplus, .pinterest, .reddit, .icon-pinterest,
#mvp-soc-mob-wrap,
#mvp-fly-wrap {
  display:none!important;
  visibility:hidden!important;
  
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
