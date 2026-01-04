// ==UserScript==
// @name        LostFilm to original
// @namespace   lostfilm_to_orig
// @description Redirect all mirrors to LostFilm.TV
// @icon        https://www.lostfilm.tv/favicon.ico
// @match       *://*.lostfilm.run/*
// @match       *://*.lostfilmtv.site/*
// @match       *://*.lostfilmtv1.site/*
// @match       *://*.lostfilmtv2.site/*
// @match       *://*.lostfilmtv3.site/*
// @match       *://*.lostfilmtv4.site/*
// @match       *://*.lostfilmtv5.site/*
// @match       *://*.lostfilm.today/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/459968/LostFilm%20to%20original.user.js
// @updateURL https://update.greasyfork.org/scripts/459968/LostFilm%20to%20original.meta.js
// ==/UserScript==

location.hostname = 'lostfilm.tv';
