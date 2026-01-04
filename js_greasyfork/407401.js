// ==UserScript==
// @name         AniList VRV external link color change (white text)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the colors of the external links for VRV on AniList (white text)
// @author       SoaringGecko
// @match        *://anilist.co/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407401/AniList%20VRV%20external%20link%20color%20change%20%28white%20text%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407401/AniList%20VRV%20external%20link%20color%20change%20%28white%20text%29.meta.js
// ==/UserScript==

GM_addStyle('a.external-link.VRV {background-color: #fd0;}');