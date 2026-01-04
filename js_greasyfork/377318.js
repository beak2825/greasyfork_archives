// ==UserScript==
// @name           Mangarock Ad Remove
// @description    Disable ads shown when reading manga
// @version        1.1
// @include        http://mangarock.com/*
// @include        https://mangarock.com/*

// @namespace https://greasyfork.org/users/235232
// @downloadURL https://update.greasyfork.org/scripts/377318/Mangarock%20Ad%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/377318/Mangarock%20Ad%20Remove.meta.js
// ==/UserScript==

// ==============
var body = document.body;
if(body !== null) {
	var div = document.createElement("style");
	div.setAttribute('type','text/css');
	div.innerHTML = "#bottom-banner-ads, iframe{display:none !important;} .slick-slide > figure {padding-bottom: calc(100vh) !important;} .trc_spotlight_widget, .trc_related_container {display:none !important}"
	body.appendChild(div);
}

// ==============