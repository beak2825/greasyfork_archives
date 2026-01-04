// ==UserScript==
// @name			1_247Sports
// @description			Fix layout/spacing after hiding top ad-banner
// @match			*://*.247sports.com/*
// @match			https://247sports.com/*
// @grant			GM_addStyle
// @namespace			https://greasyfork.org/en/scripts/463350-1_tiderinsider-mobile
// @author			sports_wook
// @version			2025.05.15.5
// @downloadURL https://update.greasyfork.org/scripts/536097/1_247Sports.user.js
// @updateURL https://update.greasyfork.org/scripts/536097/1_247Sports.meta.js
// ==/UserScript==


GM_addStyle (`

header.site-header, .homepage-wrapper, .headline-wrapper {
  top: 0px !important;
  margin-top: 0px !important;
}

`);