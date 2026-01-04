// ==UserScript==
// @name         TM WhiteBackground(Beta)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Invert Black!
// @author       紫竹FC
// @match        https://trophymanager.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495654/TM%20WhiteBackground%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495654/TM%20WhiteBackground%28Beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("div { background-color: transparent !important; }");
    GM_addStyle("tr { background-color: black !important; }");
    GM_addStyle("a { background-color: black !important; }");
    GM_addStyle("input { background-color: black !important; }");
    GM_addStyle("p { background-color: black !important; }");
    GM_addStyle(".background_gradient, .background_gradient_hover  { background: black !important; }");
    GM_addStyle("div.icons { background-color: transparent !important; }");
    GM_addStyle("div.std { background-color: black !important; }");
    GM_addStyle("#tlpop_hischat { background-color: rgb(51, 51, 51) !important; }");
    GM_addStyle("#tlpop_status { background-color: gray !important; }");
    GM_addStyle("#tooltip { background-color: #333 !important; }");
    GM_addStyle("div.co_parms { background-color: transparent !important; color: white !important;}");
    GM_addStyle(".ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { background-color: black !important; }");
    GM_addStyle("div.away.color { background-color: rgb(10,5,76) !important; }");
    GM_addStyle("#mystarbox.home.color { background-color: rgb(127,127,127) !important; }");
    GM_addStyle("#myxp.home.color { background-color: rgb(127,127,127) !important; }");
    GM_addStyle("div.home.color { background-color: rgb(127,127,127) !important; }");
    GM_addStyle("div.inner { background-color: black !important; }")
    GM_addStyle("div.buddy_list_new { background-color: black !important; }")

    document.body.style.backgroundColor = 'black';

    GM_addStyle(`
  html {
    background-color: black !important;
  }
  body {
    filter: invert(100%);
  }
  body * {
    filter: invert(100%);
  }
  body *:not(img):not(ib):not(div.menu_ico):not(span.nt_icon):not(div.tabs_new):not(co_action) {
    filter: invert(0%);
  }
`);//在最后一项增加除外

    GM_addStyle("div.tabs_new { background-image: none !important; }");
    GM_addStyle("div.tabs { background-image: none !important; }");
    GM_addStyle("div.body_end { background-image: none !important; }");
    GM_addStyle("div.body_foot { background-image: none !important; }");
    GM_addStyle("div.box_head { background-image: none !important; }");
    GM_addStyle("div.box_footer { background-image: none !important; }");
    GM_addStyle("div.overlay { background-image: none !important; }");
    GM_addStyle(".box_footer div { background-image: none !important; }");
    GM_addStyle("#top_menu { background-image: none !important; }");
    GM_addStyle("#top_menu_sub { background-image: none !important; }");
    GM_addStyle("body { background-image: none !important; }");
    GM_addStyle(".box_head h2.std { background-image: none !important; }");
    GM_addStyle("#tactics_field { background-image: none !important; }");
    GM_addStyle("#tactics_subs { background: none !important; }");
    GM_addStyle("div.text_fade_overlay { background: none !important; }");
})();