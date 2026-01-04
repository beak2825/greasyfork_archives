// ==UserScript==
// @name        Google Translate - Dark Theme
// @namespace   FawayTT
// @match       https://translate.google.com/*
// @homepage    https://github.com/FawayTT/userscripts
// @grant       GM_addStyle
// @run-at      document-start
// @version     1.0
// @author      FawayTT
// @license     MIT
// @description Dark theme for Google Translate webpage
// @downloadURL https://update.greasyfork.org/scripts/481955/Google%20Translate%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/481955/Google%20Translate%20-%20Dark%20Theme.meta.js
// ==/UserScript==
GM_addStyle(` * {
      background-color: #0e1011 !important;
      color: #cba !important;
    }
 
    body {
      background-color: #0e1011 !important;
    }
 
    element.style {
      background: #234 !important;
      opacity: 0.1 !important;
    }
 
    .vLsFwd {
      z-index: 0 !important;
    }
 
    .X4DQ0::after {
      background: transparent !important;
    }
 
    .trans-verified-button {
      background-size: cover !important;
    }
 
    .ita-kd-img {
      background-color: #cba !important;
      opacity: 85% !important;
    }
 
    .vk-cap {
      color: white !important;
    }
 
    .vk-btn {
      border: 1px solid #234 !important;
      background: rgba(255, 255, 255, 0) !important;
    }
 
    .vk-t-btn.vk-sf-cl {
      background-position: -668px -20px !important;
    }
 
    .ita-kd-arrow {
      height:23px !important;
      background-position: -620px -213px !important;
    }
 
    .ita-icon-0 {
      background-position: -13px -15px !important;
      height: 23px !important;
    }
 
    .ita-kd-dropdown-menu .ita-kd-menuitem-hover {
      background-color: #000000 !important;
    }
 
    .Dwvecf {
      border-radius: 30px !important;
    }
 
    .VK4HE {
      border-radius: 30px !important;
    }
 
    .VfPpkd-Bz112c-RLmnJb {
      background: rgba(255, 255, 255, 0) !important;
    }
 
    `);