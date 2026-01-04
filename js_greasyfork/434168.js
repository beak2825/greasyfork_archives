// ==UserScript==
// @name         Zoom_reddit
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  fix Reddit zoom on iPad
// @author       Ridflea
// @match        https://Reddit.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434168/Zoom_reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/434168/Zoom_reddit.meta.js
// ==/UserScript==

javascript:document.querySelector('meta%5Bname=viewport%5D').setAttribute('content','width=device-width,initial-scale=1.0,maximum-scale=10.0,user-scalable=1');

