// ==UserScript==
// @name         NoblisCV thing
// @namespace    mobiusevalon.tibbius.com
// @version      1.2
// @author       Mobius Evalon <mobiusevalon@tibbius.com>
// @description  Keyboard shortcuts to make the job HWTF
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @match        https://s3.amazonaws.com/TurkAnnotator/annotator.html?annotation_type=eyes_visible*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20541/NoblisCV%20thing.user.js
// @updateURL https://update.greasyfork.org/scripts/20541/NoblisCV%20thing.meta.js
// ==/UserScript==

function hotkeys(e)
{
	var radio = "";
	if(e.which === 97 || e.which === 65) radio = "covered or partially covered";
	else if(e.which === 98 || e.which === 83) radio = "not covered";
	else if(e.which === 99 || e.which === 68) radio = "bad box";
	if(radio.length)
	{
		$("input:radio[value='"+radio+"']").get(0).click();
		$("button#nextbutton, button#submitbutton").filter(":visible").get(0).click();
	}
}

$(document).ready(function() {
	$(window).on("keydown onkeydown",hotkeys);
});