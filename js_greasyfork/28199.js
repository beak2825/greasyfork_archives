// ==UserScript==
// @name         Dark 3dbooru
// @namespace    none
// @version      0.201703162058
// @description  Will darken the 3dbooru site
// @author       mysteriousLynx
// @include      *://behoimi.org/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/28199/Dark%203dbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/28199/Dark%203dbooru.meta.js
// ==/UserScript==

GM_addStyle("/******************************************** * Made by mysteriousLynx * * Last updated on Thrusday, March 16, 2017 * ********************************************/ /* Changes how the links look because they look too similar to non-links */ a:link { color: #00E6FF } a:visited { color: #00737F } /* Main darkener */ html, body { background: #101010; color: white } /* Darkens the logo */ div#static-index h1 a img, h2#site-title a img, div#static-more h2 a img { height: 0px; width: 0px; background: url(http://i.imgur.com/6viCvlf.png) no-repeat; padding-bottom: 113px; padding-right: 320px } /* Makes blockquotes easier to read */ blockquote p { color: #101010 } /* Changes table titles and page headers for the wiki and makes the table text white */ div.wiki>h2.title, table.highlightable th { color: #B966FF } table.form th { color: white } /* Change the status notice background */ div.status-notice { background: #333333 }");