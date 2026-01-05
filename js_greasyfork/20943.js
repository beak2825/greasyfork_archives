// ==UserScript==
// @name          Pety Button
// @author        Niqueish
// @description   Przekierowuje na facebookową grupę Pety Chodnikowe
// @homepage      https://www.facebook.com/Niqueish
// @version       1.0
// @include       *://*.facebook.com/*
// @require       http://code.jquery.com/jquery-2.2.1.min.js
// @grant         none
// @namespace https://greasyfork.org/users/31125
// @downloadURL https://update.greasyfork.org/scripts/20943/Pety%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/20943/Pety%20Button.meta.js
// ==/UserScript==

/* This script is licensed under the CC BY-NC-ND license.
 * CC BY-NC-ND license: https://creativecommons.org/licenses/by-nc-nd/4.0/
 */

var papysz = function()
{
	if(!$('.papysz').length){
		var $petybutton = $('<div class="fbNub _50-v _4up"><a  data-hover="tooltip" data-tooltip-content="Pety Chodnikowe" data-tooltip-delay="100" data-tooltip-alignh="right" href="https://www.facebook.com/groups/1734302383515445/" class="fbNubButton papysz"><i style="width: 16px; height: 16px; display: inline-block; background-image:url(http://i.imgur.com/20ooo5N.png)"</i></a></div>');
		$('.nubContainer').prepend($petybutton);
	}
};

papysz();
setInterval(papysz,5000);