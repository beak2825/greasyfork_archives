// ==UserScript==

// @name         Thimbleweed Park™ fixes
// @namespace    NorTreblig
// @version      0.1
// @description  Fixes menu position and improves performance (deactivates fireflies).
// @author       Nor Treblig

// @match        http://thimbleweedpark.com/*
// @match        https://thimbleweedpark.com/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/17660/Thimbleweed%20Park%E2%84%A2%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/17660/Thimbleweed%20Park%E2%84%A2%20fixes.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function main()
{
	// disable static header
	jQuery(".menu").css({ "position": "absolute" });

	if (jQuery.firefly)
	{
		// disable fireflies (performance tweak)
		jQuery(jQuery.firefly.settings.on + ' img').stop();
		// replace animated GIF with static image (performance tweak)
		jQuery(".layer3").css({ "background": "url('https://storage.googleapis.com/images.thimbleweedpark.com/www/layer3.png') no-repeat top center" });
	}
};

jQuery(document).ready(main);
