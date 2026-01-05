// ==UserScript==
// @name Tumblr.com - Hide reblogs from Dashboard
// @name:de Tumblr.com - Verhindert das Anzeigen von Reblogs auf dem Dashboard
// @namespace https://greasyfork.org
// @description This will hide any reblogs on your Tumblr dashboard.
// @description:de Dieses Skript verhindert das Anzeigen von geteilten Inhalten auf deinem Tumblr-Dashboard.
// @author yamavu
// @author Joe Schmoe
// @homepage https://greasyfork.org/scripts/3140-tumblr-com-hide-reblogs-from-dashboard
// @include http://www.tumblr.com/dashboard
// @include https://www.tumblr.com/dashboard
// @include http*://*.tumblr.com/*
// @grant GM_addStyle
// @run-at document-start
// @version 1.031
// @downloadURL https://update.greasyfork.org/scripts/3140/Tumblrcom%20-%20Hide%20reblogs%20from%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/3140/Tumblrcom%20-%20Hide%20reblogs%20from%20Dashboard.meta.js
// ==/UserScript==
(function () {
GM_addStyle('.posts .is_reblog {height:10px; !important; } .posts .is_reblog div{display:none !important; }');
}) ();