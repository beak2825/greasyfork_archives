// ==UserScript==
// @name        Hide Google Search Ads (johanb)
// @description hide the search ads
// @author      johanb
// @include     *://*.google.tld/*
// @include     *://*.google.com/*
// @include     *://*.google.co.za/*
// @include     https://google.tld/*
// @include     https://www.google.tld/*
// @version     1.4
// @run-at      document-start
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/407722/Hide%20Google%20Search%20Ads%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407722/Hide%20Google%20Search%20Ads%20%28johanb%29.meta.js
// ==/UserScript==

GM_addStyle(`.ads-ad { display: none !important; }`);
GM_addStyle(`.ads-fr { display: none !important; }`);