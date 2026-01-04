// ==UserScript==
// @name        Remove Twitter outdated banner
// @name:en     Remove Twitter outdated banner
// @description Removes Twitter outdated banner when using old Twitter
// @match       https://twitter.com/*
// @grant       GM_addStyle
// @author      rebane2001
// @run-at      document-start
// @version 0.0.1.20200220111056
// @namespace https://greasyfork.org/users/447264
// @downloadURL https://update.greasyfork.org/scripts/396630/Remove%20Twitter%20outdated%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/396630/Remove%20Twitter%20outdated%20banner.meta.js
// ==/UserScript==

// Visually remove banner with CSS so that they get removed instantly on pageload
GM_addStyle(".topbar-spacer { padding-top: 46px!important; } #banners { display: none; }");

/* Old element removal code
$("#banners").remove();
$(".topbar-spacer").remove();
*/