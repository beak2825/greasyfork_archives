// ==UserScript==
// @name        Nexus: Fix SkyrimSE links
// @description Redirects nexusmods.com/skyrimse/xxx to the right site.
// @namespace   llinstant
// @include     http://www.nexusmods.com/skyrimse/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24484/Nexus%3A%20Fix%20SkyrimSE%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/24484/Nexus%3A%20Fix%20SkyrimSE%20links.meta.js
// ==/UserScript==

var url = window.location.href;
url = url.replace("/skyrimse/", "/skyrimspecialedition/");
window.location = url;