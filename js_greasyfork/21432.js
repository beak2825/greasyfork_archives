// ==UserScript==
// @name          GyazoDirectRedirect
// @namespace     http://www.example.com/gmscripts
// @description   Redirect gyazo links to the direct image
// @include       https://gyazo.com/*
// @exclude       http://gyazo.com/downloading
// @exclude       http://gyazo.com/signup
// @exclude       http://gyazo.com/login
// @exclude       http://i.gyazo.com/*
// @version       0.1
// @icon          https://googledrive.com/host/0B4rfgKjXq2ScaXhQbFhOZk5ad1E/
// @downloadURL https://update.greasyfork.org/scripts/21432/GyazoDirectRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/21432/GyazoDirectRedirect.meta.js
// ==/UserScript==

var url = window.location.href;
var protocol = url.replace(/.*?:\/\//g, "");
var newUrl = protocol.replace(/^[^.]*/, 'i.gyazo');
var redir = newUrl + '.png';
window.location.replace('http://' + redir);