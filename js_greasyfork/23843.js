// ==UserScript==
// @name	FFN - No more Oum
// @namespace	FFNOUM
// @description	Replaces 'Oum', 'Monty' and 'Monty Oum' with God or similar, on fanfiction.net
// @include	*fanfiction.net*
// @author KD
// @grant	none
// @version	1.0.2
// @downloadURL https://update.greasyfork.org/scripts/23843/FFN%20-%20No%20more%20Oum.user.js
// @updateURL https://update.greasyfork.org/scripts/23843/FFN%20-%20No%20more%20Oum.meta.js
// ==/UserScript==

(function() {
    'use strict';

   	var txt = jQuery('#storytext').html();
	txt = txt.replace(/Monty Oum/g, "God");
	txt = txt.replace(/Oum/g, "God");
	txt = txt.replace(/Monty/g, "God");
	txt = txt.replace(/oum/g, "god");
	jQuery('#storytext').html(txt);
    
})();