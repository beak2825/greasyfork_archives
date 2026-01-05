// ==UserScript==
// @name        MTurk Clean Up Data
// @namespace   http://idlewords.net
// @description Pre-cleans data on Matt Aster's "Clean Up Data" HITs
// @include     https://s3.amazonaws.com/mturk_bulk/hits*
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11398/MTurk%20Clean%20Up%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/11398/MTurk%20Clean%20Up%20Data.meta.js
// ==/UserScript==

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function replace_words(text) {
	text = text.replace(/\s(And|Of|To|For|At|A)\s/, function(txt){return txt.toLowerCase()});
	text = text.replace(/\s([NSEW][ew]|Us\s)\s/, function(txt){return txt.toUpperCase()});
	text = text.replace(/P\.?\s?[Oo]\.?\sB/, 'PO B');
	return text;
}

if ($("p:contains('Given the information below, simply copy')").length) {
	$("p>strong").each(function(index, element) {
		var parent_p = $(this).parent();
		var text = $(this).text();
		text = text.split(": ");
		$(this).html(text[0] + "<br />\n<span style='font-weight: normal;'>&nbsp;" + text[1] + "</span>");
		header_text = text[0];
		if (text[1] !== '') {
			text = text[1].replace(" & ", " and ");
			if (header_text.search('Shelter') > -1) {
				text = text.replace(/ Inc\.?/i, '');
				text = text.replace(/ LLC\.?/i, '');
				text = text.replace(/ Ltd\.?/i, '');
				text = text.replace(/ Co\./i, '');
			}
			if (header_text.search('Address') > -1) {
				text = text.replace('.', '');
			}
			if (header_text.search('Phone') > -1 || header_text.search('Fax') > -1) {
				text = text.replace(/\(?(\d{3})[\s\)\-\/\.]?\s?(\d{3})[\s\-\.]?(\d{4})\s?x?[0-9]{0,6}?/i, '$1-$2-$3');
				text = text.replace(' ', '');
			}
			if (header_text.search('Zip') > -1) {
				if (text.length == 3) {
					text = '00' + text;
				} else if (text.length == 4) {
					text = '0' + text;
				}
			}
			text = text.toProperCase();
			text = replace_words(text);
			text = text.trim();
			//var stateList = new Array("AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY");
			while (text.search('  ') > -1) {
				text = text.replace('  ', ' ');
			}
			parent_p.next().children().eq(0).val(text);
		}
	});
	$("#ShelterName").focus();
	$(document).keydown(function(event) {
		if (event.which == 83 && event.ctrlKey) {
			event.preventDefault();
			$("#submitButton").click();
		}
	});
}