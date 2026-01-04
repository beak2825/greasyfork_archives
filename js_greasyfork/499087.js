// ==UserScript==
// @name        Hide letterboxd reviews
// @namespace   https://greasyfork.org/en/users/96096-purple-pinapples
// @match       https://letterboxd.com/film/*
// @license     MIT
// @grant       GM_addStyle
// @version     0.1
// @author      PurplePinapples
// @description Hides popular and recent reviews on letterboxd
// @downloadURL https://update.greasyfork.org/scripts/499087/Hide%20letterboxd%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/499087/Hide%20letterboxd%20reviews.meta.js
// ==/UserScript==

GM_addStyle('#popular-reviews {display: none;} #recent-reviews {display: none; }')