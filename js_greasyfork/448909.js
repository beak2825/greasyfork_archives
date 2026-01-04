// ==UserScript==
// @author	craftwar
// @name	Always desktop Wikipedia
// @description	Redirect mobile Wikipedia to desktop
// @namespace github.com.craftwar
// @include	http://*.m.wikipedia.org/*
// @include	https://*.m.wikipedia.org/*
// @version	0.1
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/448909/Always%20desktop%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/448909/Always%20desktop%20Wikipedia.meta.js
// ==/UserScript==
'use strict';
(() => {
	const m = /^(https?:\/\/[a-z]+?)(?:\.m)(\.wikipedia\.org\/.*)/.exec(window.location.href);
	if (m)
		window.location.replace(m[1] + m[2]);
})();
