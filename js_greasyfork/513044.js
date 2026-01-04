// ==UserScript==
// @name         Purplify Trakt.tv
// @namespace    http://tampermonkey.net/
// @version      2024-10-18.2
// @description  Purplify the VIP and Scrobble bar and corner ratings, hearts kept red
// @license MIT
// @author       Tusk
// @match        https://trakt.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trakt.tv
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/513044/Purplify%20Trakttv.user.js
// @updateURL https://update.greasyfork.org/scripts/513044/Purplify%20Trakttv.meta.js
// ==/UserScript==

GM_addStyle("#watching-now-wrapper > .progress-bar { background-color: rgba(68, 26, 85, .9); }");
GM_addStyle("#watching-now-wrapper { background-color: rgba(159, 66, 198, .9); }");
GM_addStyle("#results-top-wrapper.user-wrapper.watching-now #watching-now-wrapper { background-color: rgba(159, 66, 198, .9); }");
GM_addStyle("#watching-now-wrapper .percentage { background-image: linear-gradient(to right,rgba(149,23,22,0) 0%,#441a55 40%); }");
GM_addStyle(".label-vip { background-color: #9f42c6; }");
GM_addStyle(".label-vip > .ep { background-color: #441a55; }");

GM_addStyle(".corner-rating.corner-rating-1 {border-color: transparent #4a464d transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-2 {border-color: transparent #5a4d5b transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-3 {border-color: transparent #6b536b transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-4 {border-color: transparent #7c4a7c transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-5 {border-color: transparent #8c4589 transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-6 {border-color: transparent #9b3f97 transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-7 {border-color: transparent #a83aa3 transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-8 {border-color: transparent #b836af transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-9 {border-color: transparent #c631bb transparent transparent}");
GM_addStyle(".corner-rating.corner-rating-10 {border-color: transparent #d22fc9 transparent transparent}");
