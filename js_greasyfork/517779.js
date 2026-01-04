// ==UserScript==
// @name         genshin-impact-map.appsample right bar hider
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide right bar from https://genshin-impact-map.appsample.com/
// @author       reaverxai
// @match        https://genshin-impact-map.appsample.com/*
// @grant          GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517779/genshin-impact-mapappsample%20right%20bar%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/517779/genshin-impact-mapappsample%20right%20bar%20hider.meta.js
// ==/UserScript==

GM_addStyle(".MapLayout_Rightbar { display: none; }");