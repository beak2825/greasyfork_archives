// ==UserScript==
// @version      1.4
// @name         DarkBargain
// @description  Dark theme for OzBargain
// @namespace    https://gist.github.com/mattkrins
// @homepageURL  https://gist.github.com/mattkrins/520ab6712c0ee5d4b4fecf4703fff976
// @icon         https://user-images.githubusercontent.com/2367602/78972377-238d5180-7afd-11ea-9b38-4983a8281184.png
// @author       Matt Krins
// @match        *://www.ozbargain.com.au/*
// @grant        GM_addStyle
// @copyright 2018, mattkrins (https://gist.github.com/mattkrins/)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/400209/DarkBargain.user.js
// @updateURL https://update.greasyfork.org/scripts/400209/DarkBargain.meta.js
// ==/UserScript==

// Background
GM_addStyle(":root { --page-bg: #181818; }");
GM_addStyle("#header2nd { background-color: #202020; }");
GM_addStyle(":root { --shadow-bg: #000; }");
// Navigation
GM_addStyle(":root { --shade3-bg: #202020; }");
GM_addStyle("#menu > li > a { color: #aaaaaa; }");
GM_addStyle("#menu > li div.menuitem > a { color: #aaaaaa; }");
GM_addStyle(":root { --menuhl-bg: #161616; }");
GM_addStyle(":root { --shade1-bg: #333; }");
//Overlays
GM_addStyle("#overlay-box { background: #181818; }");

// Text
GM_addStyle(":root { --page-fg: #fff; }");
GM_addStyle(":root { --meta-fg: #909090; }");
GM_addStyle("h2.section { color: #cd6702; }");
GM_addStyle(":root { --link-fg: #FFF; }");
GM_addStyle(":root { --link2-fg: #EAEAEA; }");
GM_addStyle(":root { --comment-op-bg: #000; }");
GM_addStyle(":root { --comment-user-bg: #0F4A65; }");
// Visited
GM_addStyle(".title a:visited {color: var(--meta-fg);}")
// Highlighted
GM_addStyle(":root { --linkv-fg: #e69c53; }");
// Price
GM_addStyle(":root { --titlehl-fg: #e69c53; }");

// Tags
GM_addStyle(":root { --light-bg: #202020; }");
GM_addStyle(":root { --light2-bg: #000; }");

// Inputs
GM_addStyle(":root { --input-bg: #202020; }");
GM_addStyle(":root { --input-fg: #fff; }");

// Seperators
GM_addStyle(":root { --border-clr: #111; }");

// Buttons
GM_addStyle(":root { --votedown-bg: #181818; }");
GM_addStyle(":root { --votedown-fg: #fff; }");
GM_addStyle(":root { --voteup-bg: #181818; }");
GM_addStyle(":root { --voteup-fg: #fff; }");
GM_addStyle("span.nvb.votedown:hover { background-color: #181818; }");
GM_addStyle("span.nvb.voteup:hover { background-color: #181818; }");
GM_addStyle("div.c-vote.inact span.votedown:hover { background-color: #181818; }");
GM_addStyle("div.c-vote.inact span.voteup:hover { background-color: #181818; }");
GM_addStyle("div.n-vote.inact span.votedown:hover { background-color: #181818; }");
GM_addStyle("div.n-vote.inact span.voteup:hover { background-color: #181818; }");

// Search Page
GM_addStyle(" dl.search-results strong { background-color: #000; } ")

// Product List Page
GM_addStyle("div.brand a {color: var(--linkv-fg);}")

// Price History
GM_addStyle("div.nodeinfo div.extra.camelcamelcamel { color: #FFF; }")