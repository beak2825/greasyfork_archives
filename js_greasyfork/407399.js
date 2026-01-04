// ==UserScript==
// @name         AniList VRV external link color change
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Changes the colors of the external links for VRV on AniList
// @author       SoaringGecko
// @match        *://anilist.co/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407399/AniList%20VRV%20external%20link%20color%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/407399/AniList%20VRV%20external%20link%20color%20change.meta.js
// ==/UserScript==

GM_addStyle('a.external-link.VRV {background-color: #fd0;color: #1B1A26;} a.external-link.VRV:hover {color: #1B1A26;}');