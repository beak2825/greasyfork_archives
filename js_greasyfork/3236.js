// ==UserScript==
// @name           GaiaOnline - Marketplace Password Focus
// @namespace      http://userscripts.org/users/126924
// @description    Makes the Password field have focus
// @include        http://www.gaiaonline.com/marketplace/userstore/*/buy/*
// @include        http://gaiaonline.com/marketplace/userstore/*/buy/*
// @version 0.0.1.20140711222749
// @downloadURL https://update.greasyfork.org/scripts/3236/GaiaOnline%20-%20Marketplace%20Password%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/3236/GaiaOnline%20-%20Marketplace%20Password%20Focus.meta.js
// ==/UserScript==

els = document.getElementsByClassName("marketplaceInputField")
for( var i = 0; i < els.length; i++ ){
	if( els[i].name == "password" ){ els[i].focus(); break; }
}