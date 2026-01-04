// ==UserScript==
// @name         replace symbols in search SLT
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  try to take over the world!
// @author       You
// @match        https://cms.sletat.ru/LinkHotels*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390706/replace%20symbols%20in%20search%20SLT.user.js
// @updateURL https://update.greasyfork.org/scripts/390706/replace%20symbols%20in%20search%20SLT.meta.js
// ==/UserScript==

(function() {
    'use strict';

SLT_Hotels.getQueryParams = function ()
	{
		var string = $( ".inputHN", $( SLT_Hotels.options.queryControl ) ).val();
		var normalString = string.toLowerCase();
		var symbol = false;
	
			if (string.indexOf('á')) {normalString = normalString.replace(/á/g, 'a'); symbol = true;}
			if (string.indexOf('à')) {normalString = normalString.replace(/à/g, 'a'); symbol = true;}
			if (string.indexOf('â')) {normalString = normalString.replace(/â/g, 'a'); symbol = true;}
			if (string.indexOf('è')) {normalString = normalString.replace(/è/g, 'e'); symbol = true;}
			if (string.indexOf('é')) {normalString = normalString.replace(/é/g, 'e'); symbol = true;}
			if (string.indexOf('ê')) {normalString = normalString.replace(/ê/g, 'e'); symbol = true;}
			if (string.indexOf('ë')) {normalString = normalString.replace(/ë/g, 'e'); symbol = true;}
			if (string.indexOf('î')) {normalString = normalString.replace(/î/g, 'i'); symbol = true;}
			if (string.indexOf('í')) {normalString = normalString.replace(/í/g, 'i'); symbol = true;}
			if (string.indexOf('ï')) {normalString = normalString.replace(/ï/g, 'i'); symbol = true;}
			if (string.indexOf('ô')) {normalString = normalString.replace(/ô/g, 'o'); symbol = true;}
			if (string.indexOf('ù')) {normalString = normalString.replace(/ù/g, 'u'); symbol = true;}
			if (string.indexOf('û')) {normalString = normalString.replace(/û/g, 'u'); symbol = true;}
			if (string.indexOf('­ÿ')) {normalString = normalString.replace(/ÿ/g, 'y'); symbol = true;}

			if (string.indexOf('­ü')) {normalString = normalString.replace(/ü/g, 'u'); symbol = true;}
			if (string.indexOf('­ö')) {normalString = normalString.replace(/ö/g, 'o'); symbol = true;}
			if (string.indexOf('­ä')) {normalString = normalString.replace(/ä/g, 'a'); symbol = true;}

		if (symbol = true) {
			string = string + ' or ' + normalString;
		}
		var countryID = $( ".inputCID", $( SLT_Hotels.options.queryControl ) ).val();
		var startsWith = $( "input:radio:checked", $( SLT_Hotels.options.queryControl ) ).val();		
		SLT_Hotels.options.queryparam.like = string;
		SLT_Hotels.options.queryparam.onlyCurrentSource = false;
		SLT_Hotels.options.queryparam.countryId = countryID;
		SLT_Hotels.options.queryparam.startsWith = startsWith;
		SLT_Hotels.options.queryparam.currentSourceId = 0;
	}
})();