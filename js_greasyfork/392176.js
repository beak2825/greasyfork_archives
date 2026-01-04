// ==UserScript==
// @name         Gfycat/redgifs HD On
// @namespace    https://github.com/kittenparry/
// @version      0.2
// @description  Switch to HD version on page load™.
// @author       kittenparry
// @include      https://*.gfycat.com/*
// @include      https://gfycat.com/*
// @include      https://*.redgifs.com/*
// @include      https://redgifs.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/392176/Gfycatredgifs%20HD%20On.user.js
// @updateURL https://update.greasyfork.org/scripts/392176/Gfycatredgifs%20HD%20On.meta.js
// ==/UserScript==

setTimeout(() => {
	document.querySelector('span[class="settings-button"]').click();
}, 500);
