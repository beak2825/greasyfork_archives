// ==UserScript==
// @name         Steam hltb
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Finally, HLTB on Steam page
// @author       Vincenzo Canfora
// @match        https://store.steampowered.com/app/*/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_xmlhttpRequest
// @connect      herokuapp.com
// @downloadURL https://update.greasyfork.org/scripts/419033/Steam%20hltb.user.js
// @updateURL https://update.greasyfork.org/scripts/419033/Steam%20hltb.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const gameName = filterGameName(jQuery('.apphub_AppName').text(), '\w');
const gifCaricamento = '<img id="gifCaricamento" src="https://steamstore-a.akamaihd.net/public/shared/images/throbber.gif" style="margin-left: 7px" width="25" height="25">';
const silenoid = '<div id="silenoid" class="glance_ctn_responsive_left"></div>';

jQuery(".game_description_snippet").after(silenoid);

//---------------------------------------------------------------------------------------HLTB
const hltbButton = '<div id="hltbButton" class="btnv6_blue_hoverfade btn_medium" style="margin-top: 7px; margin-bottom: 7px;"><span>Get HLTB data</span></div>';

jQuery("#silenoid").append(hltbButton);

jQuery("#hltbButton").click(function() {
    jQuery("#hltbButton").off('click');
	jQuery("#hltbButton").after(gifCaricamento);
	getRequest("GET", "https://silenoids-services.herokuapp.com/hltb/" + gameName).then(response => {
	jQuery("#gifCaricamento").remove();
	if(!jQuery.isEmptyObject(response)){
		jQuery("#hltbButton").after(
			addTextLine('Main: ' + response[0].gameplayMain) + addTextLine('Main + Extra: ' + response[0].gameplayMainExtra) + addTextLine('Completionist: ' + response[0].gameplayCompletionist)
			);
		} else {
			jQuery("#hltbButton").after(addTextLine("Data not found for " + gameName));
		}
	});
});

//---------------------------------------------------------------------------------------FUNCTIONS
function addSpace() {
	return '</br>'
}

function addTextLine(text, marginTop) {
	return '<div class="game_description_snippet">' + text + '</div>';
}

function getRequest(type, url) {
	let uri = encodeURI(url);
	console.log("Request to " + uri);
	return new Promise( function(resolve,reject) {
		GM_xmlhttpRequest({
			method: type,
			url: uri,
			onload: function(response) {
				resolve(jQuery.parseJSON(response.response));
			}
		});
	})
}

function filterGameName(gameName) {
	return filterString(gameName, /[A-z]+/g);
}

function filterString(textToFilter, admittedCharRegex) {
	console.log('Filtering ', textToFilter, ' with ', admittedCharRegex);
	return (textToFilter.match(admittedCharRegex || []).join(' '));
}
