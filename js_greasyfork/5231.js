// ==UserScript==
// @name TheFastDictionary
// @author James Edward Lewis II
// @namespace greasyfork.org
// @icon http://img.tfd.com/favicon.ico
// @version 1.2
// @description This keeps TheFreeDictionary from making *every single word* into a hyperlink to its dictionary entry, thereby keeping it from becoming unresponsive for a couple minutes on long articles.
// @include http://thefreedictionary.com/*
// @include http://*.thefreedictionary.com/*
// @include https://thefreedictionary.com/*
// @include https://*.thefreedictionary.com/*
// @include http://thefreelibrary.com/*
// @include http://*.thefreelibrary.com/*
// @include https://thefreelibrary.com/*
// @include https://*.thefreelibrary.com/*
// @grant none
// @run-at document-end
// @copyright 2015 James Edward Lewis II
// @downloadURL https://update.greasyfork.org/scripts/5231/TheFastDictionary.user.js
// @updateURL https://update.greasyfork.org/scripts/5231/TheFastDictionary.meta.js
// ==/UserScript==
if (document.body.onload && typeof dictionary === 'function') document.body.onload = dictionary;
else document.body.onload = null;
